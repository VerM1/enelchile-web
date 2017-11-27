/**
 * Created by rodrigopalmafanjul on 17-05-17.
 */
angular.module('CoreModule').provider('SalesforceProvider', function() {

  return {
    $get: ['$log', '$q', 'ConnectionProvider', 'SALESFORCE_CONFIG', "$rootScope", "$cordovaNetwork", "$ionicPlatform",
      function($log, $q, ConnectionProvider, SALESFORCE_CONFIG, $rootScope, $cordovaNetwork, $ionicPlatform) {

        var apexrest = function(pathOrParams) {
          var defer = $q.defer();
          var id = _.uniqueId();
          $log.debug('Salesforce apexrest id::', id);
          force.apexrest(pathOrParams, function(result) {
            $log.debug('Success in Salesforce apexrest id::', id);
            defer.resolve(result)
          }, function(error) {
            if (err[0] && err[0].errorCode == "INVALID_SESSION_ID") {

            } else {
              $log.error('Error in salesforce apexrest id::', id);
              $log.error('error::', error);
              defer.reject(error)
            }
          });
          return defer.promise;
        };

        var request = function(obj) {
          var defer = $q.defer();
          var id = _.uniqueId();
          $log.debug('Salesforce request id::', id);
          force.request(obj, function(result) {
            $log.debug('Success in Salesforce request id::', id);
            defer.resolve(result)
          }, function(err) {
            if (err[0] && err[0].errorCode == "INVALID_SESSION_ID") {
              ConnectionProvider._recoverySessionId().then(function(success) {
                force.request(obj, function(result) {
                  $log.debug('Success in Salesforce request id::', id);
                  defer.resolve(result)
                }, function(err) {
                  if (window.cordova && $ionicPlatform.is("android") && $cordovaNetwork.getNetwork() && $cordovaNetwork.getNetwork() == "none") {
                    err = _checkForInternetConnection(err);
                  } else if (window.cordova && $ionicPlatform.is("ios") && $cordovaNetwork.getNetwork() && $cordovaNetwork.getNetwork() == "none") {
                    err = _checkForInternetConnection(err);
                  } else {
                    err = _checkForTimeout(err);
                  }
                  $log.error('Error in salesforce request id::', id);
                  $log.error('error::', err);
                  defer.reject(err)
                });
              }, function(err) {
                if (window.cordova && $ionicPlatform.is("android") && $cordovaNetwork.getNetwork() && $cordovaNetwork.getNetwork() == "none") {
                  err = _checkForInternetConnection(err);
                } else if (window.cordova && $ionicPlatform.is("ios") && $cordovaNetwork.getNetwork() && $cordovaNetwork.getNetwork() == "none") {
                  err = _checkForInternetConnection(err);
                } else {
                  err = _checkForTimeout(err);
                }
                $log.error('Error in salesforce request id::', id);
                $log.error('error::', err);
                defer.reject(err)
              })
            } else {
              if (window.cordova && $ionicPlatform.is("android") && $cordovaNetwork.getNetwork() && $cordovaNetwork.getNetwork() == "none") {
                err = _checkForInternetConnection(err);
              } else if (window.cordova && $ionicPlatform.is("ios") && $cordovaNetwork.getNetwork() && $cordovaNetwork.getNetwork() == "none") {
                err = _checkForInternetConnection(err);
              } else {
                err = _checkForTimeout(err);
              }
              $log.error('Error in salesforce request id::', id);
              $log.error('error::', err);
              defer.reject(err)
            }
          });
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
          apexrest: apexrest,
          request: request

        };
      }
    ]
  }
});