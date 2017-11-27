/**
 * Created by rodrigopalmafanjul on 17-05-17.
 */

angular.module('appenel').directive('assetFormat', function($log) {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function(scope, elm, attrs, ctrl) {
      elm.bind('blur', function() {
        if (ctrl.$viewValue != null && ctrl.$viewValue != '' && ctrl.$viewValue != 'undefined') {
          if (ctrl.$viewValue.indexOf('-') < 0) {
            ctrl.$viewValue = ctrl.$viewValue.substring(0, (ctrl.$viewValue.length - 1)) + "-" + ctrl.$viewValue.substring((ctrl.$viewValue.length - 1), ctrl.$viewValue.length);
          } else {
            $log.debug("se eliminaran todos los guiones y se reemplazaran por uno nuevo al final del texto");
            ctrl.$viewValue = ctrl.$viewValue.split("-").join("");
            ctrl.$viewValue = ctrl.$viewValue.substring(0, (ctrl.$viewValue.length - 1)) + "-" + ctrl.$viewValue.substring((ctrl.$viewValue.length - 1), ctrl.$viewValue.length);
          }
          ctrl.$render();
        }
      });
    }
  }
});