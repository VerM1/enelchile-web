angular.module('AccessModule').controller('registerCtrl', function($scope, $log, AnalyticsService, AccessService, $ionicLoading, DataMapService, $rootScope, PopupService, $state, UTILS_CONFIG) {

  $scope.forms = {};

  $scope.validateForm = function() {
    if ($scope.forms.registerForm.$valid) {
      $log.debug("datos correctos");
      registerStep1();
    } else {
      $log.debug("formulario incorrecto");
    }
  }

  function registerStep1() {
    var rutAux = $scope.forms.registerForm.rut.$viewValue;
    var n = 0;
    if (rutAux.indexOf("-") > -1) {
      n = rutAux.indexOf("-");
    } else {
      n = rutAux.length - 1;
    }
    var rutNum = rutAux.substring(0, n);
    var formatedRutNumber = rutNum + "-" + rutAux.substr(rutAux.length - 1);


    var clientAux = $scope.forms.registerForm.numClient.$viewValue;
    var m = 0;
    if (clientAux.indexOf("-") > -1) {
      m = clientAux.indexOf("-");
    } else {
      m = clientAux.length - 1;
    }
    var clientNum = clientAux.substring(0, m);
    var formatedClientNumber = clientNum + "-" + clientAux.substr(clientAux.length - 1);


    var userData = {
      rut: formatedRutNumber,
      name: $scope.forms.registerForm.names.$viewValue,
      FathersLastName: $scope.forms.registerForm.lastName.$viewValue,
      MothersLastName: $scope.forms.registerForm.motherLastName.$viewValue,
      HomePhone: $scope.forms.registerForm.phone.$viewValue,
      MobilePhone: $scope.forms.registerForm.cellphone.$viewValue,
      email: $scope.forms.registerForm.email.$viewValue,
      alias: $scope.forms.registerForm.alias.$viewValue,
      numberClient: clientNum,
      numberTicket: $scope.forms.registerForm.numLastService.$viewValue,
      newPassword: $scope.forms.registerForm.password.$viewValue,
      verifyNewPassword: $scope.forms.registerForm.passwordConfirm.$viewValue
    };
    // var str = userData.numbreClient.split("-");
    // userData.numbreClient = str[0] + str[1];
    $ionicLoading.show({
      template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
    });
    AccessService.registerUser(userData).then(function(success) {
      $ionicLoading.hide();
      DataMapService.setItem('new_user_id', success.userId);
      DataMapService.setItem('verification_step_1_rut', userData.rut);
      $state.go("guest.validation");
    }, function(err) {
      $ionicLoading.hide();
      var modalType = 'error';
      if (err.code && err.code.toString() == UTILS_CONFIG.ERROR_INFO_CODE) {
        modalType = 'info';
      }
      var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
      var modalContent = err.message;
      PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
        $scope.modal.hide();
      });
    });
  }

  function resetForm() {
    $log.debug("reseteando Registro");
    $scope.forms.registerForm.rut.$viewValue = '';
    $scope.forms.registerForm.rut.$render();
    $scope.forms.registerForm.names.$viewValue = '';
    $scope.forms.registerForm.names.$render();
    $scope.forms.registerForm.lastName.$viewValue = '';
    $scope.forms.registerForm.lastName.$render();
    $scope.forms.registerForm.motherLastName.$viewValue = '';
    $scope.forms.registerForm.motherLastName.$render();
    $scope.forms.registerForm.phone.$viewValue = '';
    $scope.forms.registerForm.phone.$render();
    $scope.forms.registerForm.cellphone.$viewValue = '';
    $scope.forms.registerForm.cellphone.$render();
    $scope.forms.registerForm.email.$viewValue = '';
    $scope.forms.registerForm.email.$render();
    $scope.forms.registerForm.alias.$viewValue = '';
    $scope.forms.registerForm.alias.$render();
    $scope.forms.registerForm.numClient.$viewValue = '';
    $scope.forms.registerForm.numClient.$render();
    $scope.forms.registerForm.numLastService.$viewValue = '';
    $scope.forms.registerForm.numLastService.$render();
    $scope.forms.registerForm.password.$viewValue = '';
    $scope.forms.registerForm.password.$render();
    $scope.forms.registerForm.passwordConfirm.$viewValue = '';
    $scope.forms.registerForm.passwordConfirm.$render();
    $scope.forms.registerForm.$setPristine();
  }

  //MÉTODO ANALYTICS -- 05-07-2017
  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
  };

  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('guest/register') > -1) {
      $log.debug("llamando a resetForm Registro");
      resetForm();
    }
  });


});