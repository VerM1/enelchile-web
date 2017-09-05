angular.module('CoreModule').controller('paymentOptionsCtrl', function($scope, $rootScope, AnalyticsService, $state, $log) {

  $scope.goToMap = function() {
    AnalyticsService.evento('Sucursales Cercanas', 'Presionar Mapa'); //Analytics
    $rootScope.tabActualAnalytics = 'Sucursales Cercanas';
    $log.debug("go goToMap");
    $log.debug("$rootScope.isLogged: " + $rootScope.isLogged);
    if ($rootScope.isLogged) {
      $state.go('session.branchesMap');
    } else {
      $state.go('guest.branchesMap');
    }
  };

});