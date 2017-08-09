/**
 * Created by rodrigopalmafanjul on 17-05-17.
 */
angular.module('CoreModule').provider('SalesforceProvider', function() {

  return {
    $get: ['$log', '$q', 'ConnectionProvider', 'SALESFORCE_CONFIG',
      function($log, $q, ConnectionProvider, SALESFORCE_CONFIG) {
        //force.init(salesforceConfig);

        // var login = function() {
        //   var defer = $q.defer();
        //   force.login(
        //     function() {
        //       $log.info("Auth succeeded");
        //       defer.resolve();
        //     },
        //     function(error) {
        //       $log.error("Auth failed: ", error);
        //       defer.reject();
        //     }
        //   );
        //   return defer.promise;
        // };

        // var query = function(query) {
        //     var defer = $q.defer();
        //     var id = _.uniqueId();
        //     $log.info('Salesforce query id::', id);
        //     force.query(query, function(result) {
        //         $log.info('Success in Salesforce query id::', id);
        //         defer.resolve(result)
        //     }, function(error) {
        //         $log.error('Error in salesforce query id::', id);
        //         $log.error('error::', error);
        //         defer.reject(error)
        //     });
        //     return defer.promise;
        // };

        var apexrest = function(pathOrParams) {
          var defer = $q.defer();
          var id = _.uniqueId();
          $log.info('Salesforce apexrest id::', id);
          force.apexrest(pathOrParams, function(result) {
            $log.info('Success in Salesforce apexrest id::', id);
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
          $log.info('Salesforce request id::', id);
          force.request(obj, function(result) {
            $log.info('Success in Salesforce request id::', id);
            defer.resolve(result)
          }, function(err) {
            if (err[0] && err[0].errorCode == "INVALID_SESSION_ID") {
              ConnectionProvider._recoverySessionId().then(function(success) {
                force.request(obj, function(result) {
                  $log.info('Success in Salesforce request id::', id);
                  defer.resolve(result)
                }, function(err) {
                  $log.error('Error in salesforce request id::', id);
                  $log.error('error::', err);
                  defer.reject(err)
                });
              }, function(err) {
                $log.error('Error in salesforce request id::', id);
                $log.error('error::', err);
                defer.reject(err)
              })
            } else {
              $log.error('Error in salesforce request id::', id);
              $log.error('error::', err);
              defer.reject(err)
            }
          });
          return defer.promise;
        };

        return {
          apexrest: apexrest,
          request: request

        };
      }
    ]
  }
});