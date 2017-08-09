angular.module('CoreModule').provider('ConnectionProvider', function() {
  var uniqueRequests = false;
  var requests = [];
  var timeout;

  Object.toparams = function(obj) {
    var p = [];
    for (var key in obj) {
      p.push(key + '=' + encodeURIComponent(obj[key]));
    }
    return p.join('&');
  };

  return {
    // $get: ['$rootScope', '$http', 'UtilsService', '$log', '$q', 'ENDPOINTS',
    //   function($rootScope, $http, UtilsService, $log, $q, ENDPOINTS) {
    $get: ['$rootScope', '$http', '$log', '$q', 'ENDPOINTS', 'LocalStorageProvider', 'SALESFORCE_CONFIG',
      function($rootScope, $http, $log, $q, ENDPOINTS, LocalStorageProvider, SALESFORCE_CONFIG) {

        var doRequest = function(endpoint, params, data, headers, success, failure, method) {
          var id = _.uniqueId();
          $log.debug('[' + id + '] REQUEST ' + method, endpoint);
          var defer = $q.defer();
          defer.promise.then(function(response) {
            success(response);
          }, function(err) {
            failure(err);
          });
          var headersAux = {
            'Content-type': 'application/json',
            'Accept-Language': 'es-ES,en-ES'
          };

          headers = headersAux;

          var request = {
            method: method,
            responseType: 'json',
            url: endpoint,
            headers: headers,
            params: params,
            data: JSON.stringify(data),
            timeout: ENDPOINTS.SETUP.TIMEOUT
          };
          if (_.findIndex(requests, request) >= 0 && uniqueRequests) {
            return false;
          }

          try {
            requests.push(request);
            $http(request).then(function(response) {
              requests = _.drop(requests, request);
              $log.groupCollapsed('[' + id + '] RESULT REQUEST ' + method.toUpperCase() + '[' + endpoint + ']');
              $log.debug('Params: ', params);
              $log.debug('Data: ', data);
              $log.debug('Response: ', response);
              $log.groupEnd();
              response = _checkForTimeout(response);
              defer.resolve(response.data);
            }, function(err) {
              requests = _.drop(requests, request);
              $log.groupCollapsed('[' + id + '] ERROR REQUEST ' + method.toUpperCase() + ' [' + endpoint + ']');
              $log.error('Params: ', params);
              $log.error('Data: ', data);
              $log.error('Response: ', err);
              $log.groupEnd();
              err = _checkForTimeout(err);
              if (err[0] && err[0].errorCode == "INVALID_SESSION_ID") {
                _recoverySessionId().then(function(success) {
                  $http(request).then(function(response) {
                    requests = _.drop(requests, request);
                    $log.groupCollapsed('[' + id + '] RESULT REQUEST ' + method.toUpperCase() + '[' + endpoint + ']');
                    $log.debug('Params: ', params);
                    $log.debug('Data: ', data);
                    $log.debug('Response: ', response);
                    $log.groupEnd();
                    response = _checkForTimeout(response);
                    defer.resolve(response.data);
                  }, function(err) {
                    requests = _.drop(requests, request);
                    $log.groupCollapsed('[' + id + '] ERROR REQUEST ' + method.toUpperCase() + ' [' + endpoint + ']');
                    $log.error('Params: ', params);
                    $log.error('Data: ', data);
                    $log.error('Response: ', err);
                    $log.groupEnd();
                    err = _checkForTimeout(err);
                    defer.reject(err);
                  });
                }, function(err) {
                  defer.reject(err);
                })
              } else {
                defer.reject(err);
              }
              defer.reject(err);
            });

          } catch (error) {
            defer.reject(error);
          }
          return defer.promise;
        };


        var _checkForTimeout = function(response) {
          if (response.data == null) { //timeout
            response = timeoutError;
          } else if (response.data.data == null && response.data.code == null && response.data.message == null) {
            response = timeoutError;
          }
          return response;
        };


        var doRequestForm = function(endpoint, params, data, headers, success, failure, method) {
          var id = _.uniqueId();
          $log.debug('[' + id + '] REQUEST ' + method, endpoint);
          var defer = $q.defer();
          defer.promise.then(function(response) {
            success(response);
          }, function(err) {
            failure(err);
          });

          var request = {
            method: method,
            url: endpoint,
            headers: headers,
            params: params,
            data: Object.toparams(data),
            // data: $.param(data),
            timeout: ENDPOINTS.SETUP.TIMEOUT
          };
          if (_.findIndex(requests, request) >= 0 && uniqueRequests) {
            return false;
          }

          try {
            requests.push(request);
            $http(request).then(function(response) {
              requests = _.drop(requests, request);
              $log.groupCollapsed('[' + id + '] RESULT REQUEST ' + method.toUpperCase() + '[' + endpoint + ']');
              $log.debug('Params: ', params);
              $log.debug('Data: ', data);
              $log.debug('Response: ', response);
              $log.groupEnd();
              defer.resolve(response.data);
            }, function(err) {
              requests = _.drop(requests, request);
              $log.groupCollapsed('[' + id + '] ERROR REQUEST ' + method.toUpperCase() + ' [' + endpoint + ']');
              $log.error('Params: ', params);
              $log.error('Data: ', data);
              $log.error('Response: ', err);
              $log.groupEnd();
              if (err.data == null) { //timeout
                err = timeoutError;
              }
              defer.reject(err);
            });

          } catch (error) {
            defer.reject(error);
          }
          return defer.promise;
        };


        function _recoverySessionId() {
          var defer = $q.defer();
          var obj = {};
          if (LocalStorageProvider.getLocalStorageItem("login_data")) {
            var loginData = LocalStorageProvider.getLocalStorageItem("login_data");
            var userNumber = loginData.userNumber;
            var password = loginData.password;
            _refreshSFTokens(userNumber, password).then(
              function(response) {
                defer.resolve();
              },
              function(err) {
                obj.error = err.code;
                obj.message = err.message;
                defer.reject(obj);
              });
          } else {
            var obj = {};
            obj.code = "400";
            obj.message = "NO SESSION_ID";
            defer.reject(obj);
          }
          return defer.promise;
        };

        function _refreshSFTokens(userNumber, password) {
          var defer = $q.defer();
          var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_GET_USER_SESSION;
          var params = {};
          var data = {
            bean: {
              rut: userNumber,
              password: password
            }
          };
          var headers = {
            'Content-type': 'application/json'
          };
          var obj = {};
          sendPost(url, params, data, headers, function(respuesta) {
            $log.info('Get User Session: ', respuesta);
            if (respuesta.code.toString() == "200") {
              var loginData = {};
              obj.userId = respuesta.data.userId;
              obj.sessionId = respuesta.data.sessionId;
              obj.contactId = respuesta.data.contactId;
              loginData.userNumber = userNumber;
              loginData.password = password;
              LocalStorageProvider.setLocalStorageItem("access_token", obj.sessionId);
              LocalStorageProvider.setLocalStorageItem("contact_id", obj.contactId);
              LocalStorageProvider.setLocalStorageItem("user_data", obj);
              LocalStorageProvider.setLocalStorageItem("login_data", loginData);
              SALESFORCE_CONFIG.accessToken = obj.sessionId;
              SALESFORCE_CONFIG.loginURL = ENDPOINTS.ENDPOINTS_SALESFORCE;
              SALESFORCE_CONFIG.proxyURL = ENDPOINTS.ENDPOINTS_SALESFORCE;
              LocalStorageProvider.setLocalStorageItem("SALESFORCE_CONFIG", SALESFORCE_CONFIG);
              obj.SALESFORCE_CONFIG = SALESFORCE_CONFIG;
              force.init(SALESFORCE_CONFIG);
              defer.resolve(obj);
            } else {
              $log.error('Error CommercialData: ' + respuesta.message);

              obj.code = respuesta.code;
              obj.message = respuesta.message;
              defer.reject(obj);
            }
          }, function(err) {
            $log.error('Error CommercialData: ' + err);
            var obj = {};
            if (err[0]) {
              obj.code = err[0].errorCode;
              obj.message = err[0].message;
            } else if (err.code) {
              obj.code = err.code;
              obj.message = err.message;
            } else if (err.data) {
              obj.code = err.data.status;
              obj.message = err.data.msg;
            } else {
              obj.code = "400";
              obj.message = err;
            }
            defer.reject(obj);
          })
          return defer.promise;
        }




        var sendPost = function(endpoint, params, data, headers, success, failure) { // jshint ignore:line
          doRequest(endpoint, params, data, headers, success, failure, 'POST');
        };

        var sendGet = function(endpoint, params, data, headers, success, failure) { // jshint ignore:line
          doRequest(endpoint, params, data, headers, success, failure, 'GET');
        };

        var sendPut = function(endpoint, params, data, headers, success, failure) { // jshint ignore:line
          doRequest(endpoint, params, data, headers, success, failure, 'PUT');
        };

        var sendDelete = function(endpoint, params, data, headers, success, failure) { // jshint ignore:line
          doRequest(endpoint, params, data, headers, success, failure, 'DELETE');
        };


        var sendPostForm = function(endpoint, params, data, headers, success, failure) { // jshint ignore:line
          doRequestForm(endpoint, params, data, headers, success, failure, 'POST');
        };


        /*INTERNAS SOLO PARA PROVIDERS*/


        var timeoutError = {
          data: {
            status: '599',
            msg: 'Se alcanzó el tiempo máximo de espera',
            message: 'Se alcanzó el tiempo máximo de espera',
            code: 599
          },
          status: 599,
          code: 599,
          message: 'Se alcanzó el tiempo máximo de espera',
        };

        return {
          sendPost: sendPost,
          sendPut: sendPut,
          sendDelete: sendDelete,
          sendGet: sendGet,
          sendPostForm: sendPostForm,
          /*INTERNAS SOLO PARA PROVIDERS*/
          _recoverySessionId: _recoverySessionId
        };
      }
    ]
  }
});