angular.module('CoreModule').controller('footerCtrl', function($scope, $state, $log, AnalyticsService, $rootScope) {
  $scope.isProfile = false;


  //MÉTODO ANALYTICS
  $scope.sendAnalytics = function(categoria, accion) {
    if (categoria === '') {
      if ($rootScope.tabActualAnalytics === '') {
        $rootScope.tabActualAnalytics = 'Resumen - Resumen';
      }
      categoria = $rootScope.tabActualAnalytics;
    }
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
    $rootScope.tabActualAnalytics = 'Perfil';
  };


  $scope.selectedTab = function(item) {
    $log.debug("elemento seleccionado: " + item);
    switch (item) {
      case 1:
        AnalyticsService.evento('Inicio', 'Presionar Inicio'); //Analytics
        $log.debug("Selected Case Number is 1");
        $state.go('guest.home');
        break;
      case 2:
        AnalyticsService.evento('Inicio', 'Presionar Emergencia'); //Analytics
        $rootScope.tabActualAnalytics = 'Emergencia';
        $log.debug("Selected Case Number is 2");
        $state.go('guest.emergency');
        break;
      case 3:
        AnalyticsService.evento('Inicio', 'Presionar Contacto'); //Analytics
        $rootScope.tabActualAnalytics = 'Contacto';
        $log.debug("Selected Case Number is 3");
        $state.go('guest.contact');
        break;
      case 4:
        AnalyticsService.evento('Inicio', 'Presionar Destacados'); //Analytics
        $rootScope.tabActualAnalytics = 'Destacados';
        $log.debug("Selected Case Number is 4");
        $state.go('guest.featured');
        break;
      case 5:
        AnalyticsService.evento('Resumen - Resumen', 'Presionar Resumen'); //Analytics
        $rootScope.tabActualAnalytics = 'Resumen';
        $log.debug("Selected Case Number is 5");
        $state.go('session.usage');
        break;
      case 6:
        AnalyticsService.evento('Resumen - Resumen', 'Presionar Emergencia'); //Analytics
        $rootScope.tabActualAnalytics = 'Emergencia';
        $log.debug("Selected Case Number is 6");
        $state.go('session.emergency');
        break;
      case 7:
        AnalyticsService.evento('Resumen - Resumen', 'Presionar Contacto'); //Analytics
        $rootScope.tabActualAnalytics = 'Contacto';
        $log.debug("Selected Case Number is 7");
        $state.go('session.contact');
        break;
      case 8:
        AnalyticsService.evento('Resumen - Resumen', 'Presionar Notificaciones'); //Analytics
        $rootScope.tabActualAnalytics = 'Notificaciones';
        $log.debug("Selected Case Number is 8");
        $state.go('session.notifications');
        break;
      case 9:
        AnalyticsService.evento('Resumen - Resumen', 'Presionar Destacados'); //Analytics
        $rootScope.tabActualAnalytics = 'Destacados';
        $log.debug("Selected Case Number is 9");
        $state.go('session.featured');
        break;
      default:
        AnalyticsService.evento('Inicio', 'Presionar Inicio'); //Analytics
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