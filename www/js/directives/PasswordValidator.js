/**
 * Created by rodrigopalmafanjul on 17-05-17.
 */

angular.module('appenel').directive('passwordValidator', function() {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function(scope, elm, attrs, ctrl) {
      function customValidator(ngModelValue) {
        // if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#\$%\-_=+<>])(?=.*(_|[^\w])).+$/.test(ngModelValue)) {
        // if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#\$%\-_=+<>]).+$/.test(ngModelValue)) {
        if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(ngModelValue)) {
          ctrl.$setValidity('passwordFormat', true);
        } else {
          ctrl.$setValidity('passwordFormat', false);
        }
        return ngModelValue;
      }
      ctrl.$parsers.push(customValidator);
    }
  }
});