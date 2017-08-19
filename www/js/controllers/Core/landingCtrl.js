angular.module('CoreModule').controller('landingCtrl', function($state, $scope, $log, $rootScope) {
  if (force.isAuthenticated()) {
    $rootScope.isLogged = true;
    $state.go("session.usage");
  } else {
    $rootScope.isLogged = false;
    $state.go("guest.home");
  }

});