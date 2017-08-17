/**
 * Created by rodrigopalmafanjul on 17-05-17.
 */

angular.module('appenel').directive('onloadSubmitForm', function($timeout) {
    return {
        scope: {
            callBack: '&iframeOnload'
        },
        link: function(scope, element, attrs) {
            console.log("scope: ", scope);
            console.log("element: ", element);
            console.log("attrs: ", attrs);
            element.bind("load", function(e) {
                console.log("onload");
            });
            $timeout(function() {
                element[0].submit();
            })
        }
    }
});