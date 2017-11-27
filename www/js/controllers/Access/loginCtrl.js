angular.module('AccessModule').controller('loginCtrl', function($scope, $state, $ionicPlatform, $rootScope, $log, AccessService, $rootScope, AnalyticsService, PopupService, $ionicLoading, UTILS_CONFIG, UtilsService, NotificationService, $sce, ENDPOINTS, $ionicScrollDelegate) {


  $scope.forms = {};
  $scope.xidDevice = $rootScope.xidDevice;

  //MÉTODO ANALYTICS
  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
  };

  $scope.validateForm = function() {
    AnalyticsService.evento($rootScope.translation.PAGE_LOGIN, $rootScope.translation.GA_PUSH_ENTER); //Analytics        
    if ($scope.forms.loginForm.$valid) {
      $log.debug("datos correctos");
      var numAux = $scope.forms.loginForm.rut.$viewValue;
      var n = 0;
      if (numAux.indexOf("-") > -1) {
        n = numAux.indexOf("-");
      } else {
        n = numAux.length - 1;
      }
      var clientNum = numAux.substring(0, n);
      var userNumber = clientNum + "-" + numAux.substr(numAux.length - 1);
      var password = $scope.forms.loginForm.password.$viewValue


      $ionicLoading.show({
        template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
      });
      var platform = "";
      if ($ionicPlatform.is("ios")) {
        platform = "IOS";
      } else if ($ionicPlatform.is("android")) {
        platform = "ANDROID";
      } else {
        platform = "WEB";
      }

      //se envia los datos en mayusculas
      userNumber = userNumber.toUpperCase();
      //

      AccessService.getLoginServices(userNumber, password, platform).then(
        function(response) {
          $log.debug("response login: ", response);
          $ionicLoading.hide();
          $rootScope.isLogged = true;
          var platformDevice = "";
          if ($ionicPlatform.is("ios")) {
            platformDevice = "ios";
          } else if ($ionicPlatform.is("android")) {
            platformDevice = "android";
          }
          UtilsService.setXID($scope.xidDevice, platformDevice);
          NotificationService.getNotificationList();

          $state.go("session.usage");
        },
        function(err) {
          AnalyticsService.evento($rootScope.translation.PAGE_LOGIN, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.LOGIN + "-" + err.message + "-" + err.analyticsCode); //Analytics 
          $log.error(err);
          $ionicLoading.hide();
          var modalType = 'error';
          if (err.code && err.code.toString() == UTILS_CONFIG.ERROR_INFO_CODE) {
            modalType = 'info';
          }
          var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
          var modalContent = err.message;
          PopupService.openModal(modalType, modalTitle, modalContent, $scope);
        });
    } else {
      $log.debug("formulario incorrecto");
    }
  }

  //LIMPIEZA DE FORMULARIO
  function resetForm() {
    $log.debug("reseteando login");
    if ($scope.forms.loginForm) {
      $scope.forms.loginForm.rut.$viewValue = '';
      $scope.forms.loginForm.password.$viewValue = '';
      $scope.forms.loginForm.rut.$render();
      $scope.forms.loginForm.password.$render();
      $scope.forms.loginForm.$setPristine();
    } else {
      $log.debug("no existe formulario aun");
    }
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };


  //RECOVERY PASS NEOL
  $scope.recoveryPassNeol = function() {
    AnalyticsService.evento($rootScope.translation.PAGE_LOGIN, $rootScope.translation.GA_PUSH_PASSWORD_RECOVERY);
    var modalType = 'iframe';
    var modalTitle = $rootScope.translation.HELPER_MODAL_TITLE;
    var modalContent = $sce.trustAsResourceUrl(ENDPOINTS.ENDPOINTS_EXTERNAL_RECOVERY_PASS_NEOL);

    $ionicLoading.show({
      template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
    });
    PopupService.openModal(modalType, modalTitle, modalContent, $scope);
  }

  $scope.goBack = function() {
    AnalyticsService.evento($rootScope.translation.PAGE_LOGIN, $rootScope.translation.GA_PUSH_BACK_BUTTON); //Llamada a Analytics
    $state.go("guest.home");
  };




  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('guest/login') > -1) {
      $log.debug("llamando a resetForm Login");
      AnalyticsService.pantalla($rootScope.translation.PAGE_LOGIN);
      $ionicScrollDelegate.scrollTop();
      resetForm();
    }
  });

});