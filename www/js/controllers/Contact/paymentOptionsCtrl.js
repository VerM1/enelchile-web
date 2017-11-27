angular.module('CoreModule').controller('paymentOptionsCtrl', function($scope, $rootScope, AnalyticsService, $state, $log, $ionicScrollDelegate) {

  $scope.goToMap = function() {
    AnalyticsService.evento($rootScope.translation.PAGE_BRANCHES_PAYMENT_OPTIONS, $rootScope.translation.GA_PUSH_BACK_BUTTON); //Analytics
    $rootScope.tabActualAnalytics = 'Sucursales Cercanas';
    $log.debug("go goToMap");
    $log.debug("$rootScope.isLogged: " + $rootScope.isLogged);
    if ($rootScope.isLogged) {
      $state.go('session.branchesMap');
    } else {
      $state.go('guest.branchesMap');
    }
  };

  //MÉTODO ANALYTICS
  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
  };


  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('session/paymentOptions') > -1 || n.indexOf('guest/paymentOptions') > -1) {
      AnalyticsService.pantalla($rootScope.translation.PAGE_BRANCHES_PAYMENT_OPTIONS);
      $ionicScrollDelegate.scrollTop();
    }
  });

});