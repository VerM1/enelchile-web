/**
 * Created by rodrigopalmafanjul on 17-05-17.
 */

angular.module('appenel').directive('validateFormFocus', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, elem) {

      // set up event handler on the form element
      elem.on('submit', function() {

        // find the first invalid element
        var firstInvalid = elem[0].querySelector('.ng-invalid');

        // if we find one, set focus
        if (firstInvalid) {
          firstInvalid.focus();
        }
      });
    }
  };
});