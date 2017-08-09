/**
 * Created by rodrigopalmafanjul on 17-05-17.
 */

angular.module('appenel').directive('assetValidator', function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, elm, attrs, ctrl) {
            function customValidator(ngModelValue) {
                if (/^(?=(?:\D*\d){2})[a-zA-Z0-9]*$/.test(ngModelValue)) {
                    ctrl.$setValidity('twoNumbersValidator', true);
                } else {
                    ctrl.$setValidity('twoNumbersValidator', false);
                }
                if (/^\d+/.test(ngModelValue)) {
                    ctrl.$setValidity('startWithNumberValidator', true);
                } else {
                    ctrl.$setValidity('startWithNumberValidator', false);
                }
                return ngModelValue;
            }
            ctrl.$parsers.push(customValidator);
        }
    }
});