/**
 * Created by rodrigopalmafanjul on 17-05-17.
 */

angular.module('appenel').directive('onloadSubmitForm', function($timeout) {
  return {
    scope: {
      callBack: '&iframeOnload'
    },
    link: function(scope, element, attrs) {
      element.bind("load", function(e) {});
      $timeout(function() {
        element[0].submit();
      }, 500);
    }
  }
});