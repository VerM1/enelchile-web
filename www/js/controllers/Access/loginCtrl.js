angular.module('AccessModule').controller('loginCtrl', function($scope, $state, $rootScope, $log, AccessService, $rootScope, AnalyticsService, PopupService, $ionicLoading, UTILS_CONFIG) {
  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
  };

  // $scope.login = function() {
  //     AnalyticsService.evento('Ingresar', 'Presionar Ingresar'); //Analytics
  //     AccessService.getLoginAccess(isMovilDevice).then(
  //         function(response) {
  //             $log.info("response login: ", response);
  //             force.init(response);
  //             $rootScope.isLogged = true;
  //             AccessService.getContactId().then(function(idContact) {
  //                 $log.debug('contactId::', idContact);
  //                 $rootScope.contactId = '0037A00000LCKj9QAH';
  //                 $state.go("session.usage");
  //             }, function(err) {
  //                 $log.error('Error obteniendo idContact::', err);
  //             });
  //         },
  //         function(error) {
  //             $log.error(error);
  //         });
  // }

  $scope.forms = {};

  $scope.validateForm = function() {
    AnalyticsService.evento('Ingresar', 'Presionar Ingresar'); //Analytics
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
      AccessService.getLoginServices(userNumber, password).then(
        function(response) {
          $log.info("response login: ", response);
          $ionicLoading.hide();
          $rootScope.isLogged = true;
          // $rootScope.contactId = response.contactId;
          $state.go("session.usage");
        },
        function(err) {
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
    $log.info("reseteando login");
    if ($scope.forms.loginForm) {
      $scope.forms.loginForm.rut.$viewValue = '';
      $scope.forms.loginForm.password.$viewValue = '';
      $scope.forms.loginForm.rut.$render();
      $scope.forms.loginForm.password.$render();
      $scope.forms.loginForm.$setPristine();
    } else {
      $log.info("no existe formulario aun");
    }
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('guest/login') > -1) {
      $log.debug("llamando a resetForm Login");
      resetForm();
    }
  });

});