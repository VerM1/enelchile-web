/**
 * Created by rodrigopalmafanjul on 17-05-17.
 */

angular.module('appenel').directive('hideKeyboardOnSubmit', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, elem) {

      // set up event handler on the form element
      elem.on('submit', function() {
        // find the first input element
        var textFields = elem[0].querySelector('input');
        textFields.blur();
      });
    }
  };
});