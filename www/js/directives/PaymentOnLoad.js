/**
 * Created by rodrigopalmafanjul on 17-05-17.
 */

angular.module('appenel')
    .directive('paymenturlload', function(ENDPOINTS, $ionicLoading) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('load', function() {
                    // var content = angular.element(document.querySelector('iframe')).contents();
                    // console.log("content: ", content);
                    // var content0 = angular.element(document.querySelector('iframe')).contents()[0];
                    // console.log("content0: ", content0);
                    // var url = angular.element(document.querySelector('iframe')).contents()[0].URL;
                    // if (url) {
                    //     $ionicLoading.hide();
                    // }
                    // if (url.includes(ENDPOINTS.ENDPOINTS_PAYMENT_SUCCESS)) {
                    //     scope.generateTemplateBill("successPayment", url);
                    // }
                    // if (url.includes(ENDPOINTS.ENDPOINTS_PAYMENT_ERROR)) {
                    //     scope.generateTemplateBill("info", url);
                    // }

                    if (element[0].contentDocument) {
                        $ionicLoading.hide();
                        var url = element[0].contentDocument.URL;
                        if (url.includes(ENDPOINTS.ENDPOINTS_PAYMENT_SUCCESS)) {
                            scope.generateTemplateBill("successPayment", url);
                        }
                        if (url.includes(ENDPOINTS.ENDPOINTS_PAYMENT_ERROR)) {
                            scope.generateTemplateBill("info", url);
                        }
                    } else {
                        $ionicLoading.hide();
                    }

                });
            }
        };
    });