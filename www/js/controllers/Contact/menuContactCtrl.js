angular.module('LocationsModule').controller('menuContactCtrl', function($scope, $state, UtilsService, $rootScope, $log, AnalyticsService, UTILS_CONFIG) {

  //Contacto- Llamar
  $scope.goCall = function() {

    AnalyticsService.evento('Contacto', 'Presionar Atención Telefónica'); //Analytics

  }
  $scope.goContactForm = function() {

    AnalyticsService.evento('Contacto', 'Presionar Formulario de Contacto'); //Analytics
    $rootScope.tabActualAnalytics = 'Contacto - Formulario de Contacto';
    $log.debug("go contact form");
    $log.debug("$rootScope.isLogged: " + $rootScope.isLogged);
    if ($rootScope.isLogged) {
      $state.go('session.contactForm');
    } else {
      $state.go('guest.contactForm');
    }
  }

  $scope.goBranchesMap = function() {

    AnalyticsService.evento('Contacto', 'Presionar Sucursales'); //Analytics
    $rootScope.tabActualAnalytics = 'Contacto - Sucursales';
    $log.debug("go branches map");
    $log.info("$rootScope.isLogged: " + $rootScope.isLogged);
    if ($rootScope.isLogged) {
      $state.go('session.branchesMap');
    } else {
      $state.go('guest.branchesMap');
    }
  }

  $scope.phoneNumber = UTILS_CONFIG.CONTACT_PHONE_NUMER;

});