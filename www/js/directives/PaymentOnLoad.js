/**
 * Created by rodrigopalmafanjul on 17-05-17.
 */

angular.module('appenel')
  .directive('paymenturlload', function(ENDPOINTS, $ionicLoading) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.bind('load', function() {
          $ionicLoading.hide();
          if (element[0].contentDocument) {
            var url = element[0].contentDocument.URL;
            if (_.includes(url, ENDPOINTS.ENDPOINTS_PAYMENT_SUCCESS)) {
              scope.generateTemplateBill("successPayment", url);
            }
            if (_.includes(url, ENDPOINTS.ENDPOINTS_PAYMENT_ERROR)) {
              scope.generateTemplateBill("info", url);
            }
          }
        });
      }
    };
  });