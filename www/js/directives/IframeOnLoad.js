/**
 * Created by rodrigopalmafanjul on 17-05-17.
 */

angular.module('appenel')
    .directive('iframeurlload', function(ENDPOINTS, $ionicLoading) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('load', function() {
                    console.log("scope:", scope);
                    console.log("element:", element);
                    console.log("attrs:", attrs);
                    if (element[0].contentDocument) {
                        element[0].contentDocument.getElementById("buscador").style.width = "100%";
                        $ionicLoading.hide();
                    } else {
                        $ionicLoading.hide();
                    }

                });
            }
        };
    });