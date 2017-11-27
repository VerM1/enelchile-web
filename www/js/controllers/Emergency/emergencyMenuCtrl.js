angular.module('CoreModule').controller('emergencyMenuCtrl', function($scope, $state, $rootScope, $log, AnalyticsService, $ionicScrollDelegate) {
  $scope.goToBlackOut = function() {
    AnalyticsService.evento($rootScope.translation.PAGE_EMERGENCY, $rootScope.translation.GA_PUSH_BLACKOUT); //Analytics
    $rootScope.tabActualAnalytics = 'Corte de Luz';
    $log.debug("go blackout");
    $log.debug("force.isAuthenticated(): " + force.isAuthenticated());
    if (force.isAuthenticated()) {
      $state.go('session.blackout');
    } else {
      $state.go('guest.preBlackout');
    }
  }

  $scope.goToLightingProblems = function() {
    AnalyticsService.evento($rootScope.translation.PAGE_EMERGENCY, $rootScope.translation.GA_PUSH_LIGHTING_PROBLEMS); //Analytics
    $rootScope.tabActualAnalytics = 'Problemas de Alumbrado';
    $log.debug("go lightingProblems");
    $log.debug("force.isAuthenticated(): " + force.isAuthenticated());
    if (force.isAuthenticated()) {
      $state.go('session.lightingProblems');
    } else {
      $state.go('guest.lightingProblems');
    }
  }

  $scope.goToAccidentRisk = function() {
    AnalyticsService.evento($rootScope.translation.PAGE_EMERGENCY, $rootScope.translation.GA_PUSH_ACCIDENT_RISK); //Analytics
    $rootScope.tabActualAnalytics = 'Riesgo o Accidente';
    $log.debug("go accidentRisk");
    $log.debug("force.isAuthenticated(): " + force.isAuthenticated());
    if (force.isAuthenticated()) {
      $state.go('session.accidentRisk');
    } else {
      $state.go('guest.accidentRisk');
    }
  }

  //MÉTODO ANALYTICS -- 05-07-2017
  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
  };

  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('guest/emergencyMenu') > -1 || n.indexOf('session/emergencyMenu') > -1) {
      AnalyticsService.pantalla($rootScope.translation.PAGE_EMERGENCY);
      $ionicScrollDelegate.scrollTop();
    }
  });

});