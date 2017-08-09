angular.module('CoreModule').controller('emergencyCtrl', function($scope, $state, $rootScope, $log, AnalyticsService) {
  $scope.goToBlackOut = function() {
    AnalyticsService.evento('Emergencia', 'Presionar Reportar Emergencia'); //Analytics
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
    AnalyticsService.evento('Emergencia', 'Presionar Reportar Problemas de Alumbrado'); //Analytics
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
    AnalyticsService.evento('Emergencia', 'Presionar Reportar Riesgo o Accidente'); //Analytics
    $rootScope.tabActualAnalytics = 'Riesgo o Accidente';
    $log.debug("go accidentRisk");
    $log.debug("force.isAuthenticated(): " + force.isAuthenticated());
    if (force.isAuthenticated()) {
      $state.go('session.accidentRisk');
    } else {
      $state.go('guest.accidentRisk');
    }
  }

});