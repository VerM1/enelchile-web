/**
 * Created by rodrigopalmafanjul on 17-05-17.
 */

angular.module('appenel').directive('assetFormat', function($log) {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, elm, attrs, ctrl) {
            elm.on('keydown', function(event) {
                if (event.which == 64 || event.which == 16) {
                    // to allow numbers  
                    return false;
                } else if (event.which >= 48 && event.which <= 57) {
                    // to allow numbers  
                    return true;
                } else if (event.which >= 96 && event.which <= 105) {
                    // to allow numpad number  
                    return true;
                } else if ([8, 13, 27, 37, 38, 39, 40].indexOf(event.which) > -1) {
                    // to allow backspace, enter, escape, arrows  
                    return true;
                } else if (event.which == 189 || event.which == 150 || event.which == 151) {
                    // to allow script  
                    return true;
                } else if (event.which == 75 || event.which == 107) {
                    // to allow script  
                    return true;
                } else {
                    event.preventDefault();
                    // to stop others  
                    return false;
                }
            });
            elm.bind('blur', function() {
                $log.debug("onblur_2");
                $log.debug("onblur_2 value: ", ctrl.$viewValue);
                if (ctrl.$viewValue != null && ctrl.$viewValue != '' && ctrl.$viewValue != 'undefined') {
                    if (ctrl.$viewValue.indexOf('-') < 0) {
                        ctrl.$viewValue = ctrl.$viewValue.substring(0, (ctrl.$viewValue.length - 1)) + "-" + ctrl.$viewValue.substring((ctrl.$viewValue.length - 1), ctrl.$viewValue.length);
                    } else {
                        $log.debug("hacer nada");
                    }
                    ctrl.$render();
                }
            });
        }
    }
});