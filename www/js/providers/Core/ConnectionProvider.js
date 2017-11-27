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
    $get: ['$rootScope', '$http', '$log', '$q', 'ENDPOINTS', 'LocalStorageProvider', 'SALESFORCE_CONFIG', '$state', 'PopupService', "$cordovaNetwork", "$ionicPlatform",
      function($rootScope, $http, $log, $q, ENDPOINTS, LocalStorageProvider, SALESFORCE_CONFIG, $state, PopupService, $cordovaNetwork, $ionicPlatform) {
        // var translation = $rootScope.translation;

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
              if (window.cordova && $ionicPlatform.is("android") && $cordovaNetwork.getNetwork() && $cordovaNetwork.getNetwork() == "none") {
                response = _checkForInternetConnection(response);
              } else if (window.cordova && $ionicPlatform.is("ios") && $cordovaNetwork.getNetwork() && $cordovaNetwork.getNetwork() == "none") {
                response = _checkForInternetConnection(response);
              } else {
                response = _checkForTimeout(response);
              }
              defer.resolve(response.data);
            }, function(err) {
              requests = _.drop(requests, request);
              $log.groupCollapsed('[' + id + '] ERROR REQUEST ' + method.toUpperCase() + ' [' + endpoint + ']');
              $log.error('Params: ', params);
              $log.error('Data: ', data);
              $log.error('Response: ', err);
              $log.groupEnd();
              if (window.cordova && $ionicPlatform.is("android") && $cordovaNetwork.getNetwork() && $cordovaNetwork.getNetwork() == "none") {
                err = _checkForInternetConnection(err);
              } else if (window.cordova && $ionicPlatform.is("ios") && $cordovaNetwork.getNetwork() && $cordovaNetwork.getNetwork() == "none") {
                err = _checkForInternetConnection(err);
              } else {
                err = _checkForTimeout(err);
              }
              if (err[0] && err[0].errorCode == "INVALID_SESSION_ID") {
                _recoverySessionId().then(function(success) {
                  $http(request).then(function(response) {
                    requests = _.drop(requests, request);
                    $log.groupCollapsed('[' + id + '] RESULT REQUEST ' + method.toUpperCase() + '[' + endpoint + ']');
                    $log.debug('Params: ', params);
                    $log.debug('Data: ', data);
                    $log.debug('Response: ', response);
                    $log.groupEnd();
                    if (window.cordova && $ionicPlatform.is("android") && $cordovaNetwork.getNetwork() && $cordovaNetwork.getNetwork() == "none") {
                      response = _checkForInternetConnection(response);
                    } else if (window.cordova && $ionicPlatform.is("ios") && $cordovaNetwork.getNetwork() && $cordovaNetwork.getNetwork() == "none") {
                      response = _checkForInternetConnection(response);
                    } else {
                      response = _checkForTimeout(response);
                    }
                    defer.resolve(response.data);
                  }, function(err) {
                    requests = _.drop(requests, request);
                    $log.groupCollapsed('[' + id + '] ERROR REQUEST ' + method.toUpperCase() + ' [' + endpoint + ']');
                    $log.error('Params: ', params);
                    $log.error('Data: ', data);
                    $log.error('Response: ', err);
                    $log.groupEnd();
                    if (window.cordova && $ionicPlatform.is("android") && $cordovaNetwork.getNetwork() && $cordovaNetwork.getNetwork() == "none") {
                      err = _checkForInternetConnection(err);
                    } else if (window.cordova && $ionicPlatform.is("ios") && $cordovaNetwork.getNetwork() && $cordovaNetwork.getNetwork() == "none") {
                      err = _checkForInternetConnection(err);
                    } else {
                      err = _checkForTimeout(err);
                    }
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


        var _checkForInternetConnection = function(response) {
          response = timeoutInternetConnection;
          return response;
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
              if (window.cordova && $ionicPlatform.is("android") && $cordovaNetwork.getNetwork() && $cordovaNetwork.getNetwork() == "none") {
                response = _checkForInternetConnection(response);
              } else if (window.cordova && $ionicPlatform.is("ios") && $cordovaNetwork.getNetwork() && $cordovaNetwork.getNetwork() == "none") {
                response = _checkForInternetConnection(response);
              } else {
                response = _checkForTimeout(response);
              }
              defer.resolve(response.data);
            }, function(err) {
              requests = _.drop(requests, request);
              $log.groupCollapsed('[' + id + '] ERROR REQUEST ' + method.toUpperCase() + ' [' + endpoint + ']');
              $log.error('Params: ', params);
              $log.error('Data: ', data);
              $log.error('Response: ', err);
              $log.groupEnd();
              if (window.cordova && $ionicPlatform.is("android") && $cordovaNetwork.getNetwork() && $cordovaNetwork.getNetwork() == "none") {
                err = _checkForInternetConnection(err);
              } else if (window.cordova && $ionicPlatform.is("ios") && $cordovaNetwork.getNetwork() && $cordovaNetwork.getNetwork() == "none") {
                err = _checkForInternetConnection(err);
              } else {
                err = _checkForTimeout(err);
              }
              // if (err.data == null) { //timeout
              //     err = timeoutError;
              // }
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
          if (LocalStorageProvider.getLocalStorageItem("USER_DATA")) {
            var userData = LocalStorageProvider.getLocalStorageItem("USER_DATA");
            var userNumber = userData.rut;
            var password = userData.password;
            _refreshSFTokens(userNumber, password).then(
              function(response) {
                defer.resolve();
              },
              function(err) {
                if (err.code && err.code === "400") {
                  obj.error = err.code;
                  obj.message = err.message;
                  defer.reject(obj);
                  var modalType = 'error';
                  var modalTitle = $rootScope.translation.ERROR_MODAL_TITLE;
                  var modalContent = err.message + ". " + $rootScope.translation.LOGOUT_PROCEED;
                  PopupService.openModal(modalType, modalTitle, modalContent, $rootScope, function() {
                    $rootScope.modal.remove()
                      .then(function() {
                        $rootScope.modal = null;
                        try {
                          force.discardToken();
                          var exception = [];
                          exception.push("branches");
                          exception.push("no_session_client_number");
                          exception.push("no_session_form_data");
                          exception.push("pass_tuto");
                          exception.push("show_rotate_icon");
                          exception.push("app_version");
                          LocalStorageProvider.removeLocalStorageItemExcept(exception);
                          SALESFORCE_CONFIG.accessToken = '';
                          // SALESFORCE_CONFIG.refreshToken = '';
                          $rootScope.isLogged = false;
                          $state.go("guest.home");
                        } catch (err) {
                          $log.error("err: ", err);
                          $state.go("guest.home");
                        }
                      });
                  });
                }
              });
          } else {
            var obj = {};
            obj.code = "-1";
            obj.message = "NO SESSION ID";
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
            $log.debug('Get User Session: ', respuesta);
            if (respuesta.code.toString() == "200") {
              if (LocalStorageProvider.getLocalStorageItem("USER_DATA")) {
                obj = LocalStorageProvider.getLocalStorageItem("USER_DATA")
              }
              obj.sessionId = respuesta.data.sessionId;
              LocalStorageProvider.setLocalStorageItem("USER_DATA", obj);
              SALESFORCE_CONFIG.accessToken = obj.sessionId;
              SALESFORCE_CONFIG.loginURL = ENDPOINTS.ENDPOINTS_SALESFORCE;
              SALESFORCE_CONFIG.proxyURL = ENDPOINTS.ENDPOINTS_SALESFORCE;
              LocalStorageProvider.setLocalStorageItem("SALESFORCE_CONFIG", SALESFORCE_CONFIG);
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


        var timeoutInternetConnection = {
          data: {
            status: '-1',
            msg: 'Sin conexión a Internet. Verifica tu equipo e intenta nuevamente.',
            message: 'Sin conexión a Internet. Verifica tu equipo e intenta nuevamente.',
            code: -1
          },
          status: -1,
          code: -1,
          msg: 'Sin conexión a Internet. Verifica tu equipo e intenta nuevamente.',
          message: 'Sin conexión a Internet. Verifica tu equipo e intenta nuevamente.',
        };

        var timeoutError = {
          data: {
            status: '408',
            msg: 'En estos momentos no es posible procesar la solicitud, por favor inténtalo más tarde.',
            message: 'En estos momentos no es posible procesar la solicitud, por favor inténtalo más tarde.',
            code: 408
          },
          status: 408,
          code: 408,
          msg: 'En estos momentos no es posible procesar la solicitud, por favor inténtalo más tarde.',
          message: 'En estos momentos no es posible procesar la solicitud, por favor inténtalo más tarde.',
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