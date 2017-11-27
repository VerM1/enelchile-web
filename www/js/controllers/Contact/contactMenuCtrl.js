angular.module('LocationsModule').controller('contactMenuCtrl', function($scope, $state, UtilsService, $rootScope, $log, AnalyticsService, UTILS_CONFIG, ENDPOINTS, $ionicScrollDelegate) {

  //Contacto- Llamar
  $scope.goCall = function() {
    AnalyticsService.evento($rootScope.translation.PAGE_CONTACT, $rootScope.translation.GA_PUSH_TELEPHONE_ATTENTION); //Analytics
  }

  $scope.goContactForm = function() {
    AnalyticsService.evento($rootScope.translation.PAGE_CONTACT, $rootScope.translation.GA_PUSH_CONTACT_FORM); //Analytics
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
    AnalyticsService.evento($rootScope.translation.PAGE_CONTACT, $rootScope.translation.GA_PUSH_BRANCHES); //Analytics
    $rootScope.tabActualAnalytics = 'Contacto - Sucursales';
    $log.debug("go branches map");
    $log.debug("$rootScope.isLogged: " + $rootScope.isLogged);
    if ($rootScope.isLogged) {
      $state.go('session.branchesMap');
    } else {
      $state.go('guest.branchesMap');
    }
  }

  $scope.openUrl = function(url, title) {
    AnalyticsService.evento($rootScope.translation.PAGE_CONTACT, $rootScope.translation.GA_PUSH_OPEN_EXTERNAL_LINKS + ": " + title); //Analytics
    window.open(url, '_system');
  };

  $scope.phoneNumber = UTILS_CONFIG.CONTACT_PHONE_NUMER;
  $scope.facebookUrl = ENDPOINTS.ENDPOINTS_FACEBOOK;
  $scope.twitterUrl = ENDPOINTS.ENDPOINTS_TWITTER;

  //MÉTODO ANALYTICS
  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
  };


  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('guest/contactMenu') > -1 || n.indexOf('session/contactMenu') > -1) {
      AnalyticsService.pantalla($rootScope.translation.PAGE_CONTACT);
      $ionicScrollDelegate.scrollTop();
    }
  });

});