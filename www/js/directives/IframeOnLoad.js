/**
 * Created by rodrigopalmafanjul on 17-05-17.
 */

angular.module('appenel')
  .directive('iframeurlload', function(ENDPOINTS, $ionicLoading) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.bind('load', function() {
          $ionicLoading.hide();
          if (element[0] && element[0].contentDocument && element[0].contentDocument.getElementById("buscador")) {
            element[0].contentDocument.getElementById("buscador").style.width = "100%";
            element[0].contentDocument.getElementById("buscador").style.height = "100%";
          }
        });
      }
    };
  });