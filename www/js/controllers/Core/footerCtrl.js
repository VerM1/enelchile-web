angular.module('CoreModule').controller('footerCtrl', function($scope, $state, $log, AnalyticsService, $rootScope, $ionicLoading, NotificationService) {
  $scope.isProfile = false;

  $scope.logoActionButton = function() {
    AnalyticsService.evento($rootScope.translation.HEADER, $rootScope.translation.GA_PUSH_LOGO_ICON); //Analytics  
    if ($rootScope.isLogged) {
      $state.go("session.usage");
    } else {
      $state.go("guest.home");
    }
  }

  //MÉTODO ANALYTICS
  $scope.goToProfile = function(categoria, accion) {
    // if (categoria === '') {
    //   if ($rootScope.tabActualAnalytics === '') {
    //     $rootScope.tabActualAnalytics = 'Resumen - Resumen';
    //   }
    //   categoria = $rootScope.tabActualAnalytics;
    // }
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
    $rootScope.tabActualAnalytics = 'Perfil';
    $state.go("session.profile");
  };


  $scope.selectedTab = function(item) {
    $log.debug("elemento seleccionado: " + item);
    switch (item) {
      case 1:
        AnalyticsService.evento($rootScope.translation.FOOTER, $rootScope.translation.GA_PUSH_HOME); //Analytics
        $log.debug("Selected Case Number is 1");
        $state.go('guest.home');
        break;
      case 2:
        AnalyticsService.evento($rootScope.translation.FOOTER, $rootScope.translation.GA_PUSH_EMERGENCY); //Analytics
        $rootScope.tabActualAnalytics = 'Emergencia';
        $log.debug("Selected Case Number is 2");
        $state.go('guest.emergencyMenu');
        break;
      case 3:
        AnalyticsService.evento($rootScope.translation.FOOTER, $rootScope.translation.GA_PUSH_CONTACT); //Analytics
        $rootScope.tabActualAnalytics = 'Contacto';
        $log.debug("Selected Case Number is 3");
        $state.go('guest.contactMenu');
        break;
      case 4:
        AnalyticsService.evento($rootScope.translation.FOOTER, $rootScope.translation.GA_PUSH_FEATURED); //Analytics
        $rootScope.tabActualAnalytics = 'Destacados';
        $log.debug("Selected Case Number is 4");
        $state.go('guest.featuredList');
        break;
      case 5:
        AnalyticsService.evento($rootScope.translation.FOOTER, $rootScope.translation.GA_PUSH_USAGE); //Analytics
        $rootScope.tabActualAnalytics = 'Resumen';
        $log.debug("Selected Case Number is 5");
        $state.go('session.usage');
        break;
      case 6:
        AnalyticsService.evento($rootScope.translation.FOOTER, $rootScope.translation.GA_PUSH_EMERGENCY); //Analytics
        $rootScope.tabActualAnalytics = 'Emergencia';
        $log.debug("Selected Case Number is 6");
        $state.go('session.emergencyMenu');
        break;
      case 7:
        AnalyticsService.evento($rootScope.translation.FOOTER, $rootScope.translation.GA_PUSH_CONTACT); //Analytics
        $rootScope.tabActualAnalytics = 'Contacto';
        $log.debug("Selected Case Number is 7");
        $state.go('session.contactMenu');
        break;
      case 8:
        AnalyticsService.evento($rootScope.translation.FOOTER, $rootScope.translation.GA_PUSH_NOTIFICATIONS); //Analytics
        $rootScope.tabActualAnalytics = 'Notificaciones';
        $log.debug("Selected Case Number is 8");
        $state.go('session.notification');
        break;
      case 9:
        AnalyticsService.evento($rootScope.translation.FOOTER, $rootScope.translation.GA_PUSH_FEATURED); //Analytics
        $rootScope.tabActualAnalytics = 'Destacados';
        $log.debug("Selected Case Number is 9");
        $state.go('session.featuredList');
        break;
      default:
        AnalyticsService.evento($rootScope.translation.FOOTER, $rootScope.translation.GA_PUSH_HOME); //Analytics
        $rootScope.tabActualAnalytics = 'Inicio';
        $state.go('guest.home');
        break;
    }
  }

  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('session/profile') > -1) {
      $log.debug("isprofile=true");
      $scope.isProfile = true;
    } else {
      $log.debug("isprofile=false");
      $scope.isProfile = false;
    }
  });
});