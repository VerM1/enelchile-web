/**
 * Created by rodrigopalmafanjul on 17-05-17.
 */

angular.module('appenel')
  .directive('notification', function($state) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.on('click', function() {
          $state.go("session.notification");
        });
      }
    };
  });