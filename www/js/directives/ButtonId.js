/**
 * Created by rodrigopalmafanjul on 17-05-17.
 */

angular.module('appenel').directive('buttonId', function() {
  return {
    restrict: "A",
    link: function(scope, element, attributes) {
      element.bind("click", function() {
        scope.buttons.chosen = attributes.buttonId;
      });
    }
  }
});