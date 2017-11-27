angular.module('AccessModule').controller('verificationStepTwoCtrl', function($state, $scope, $log, DataMapService, AccessService, PopupService, $ionicLoading, $rootScope, UTILS_CONFIG, AnalyticsService, $ionicScrollDelegate) {

  $scope.forms = {};

  $scope.formValidation = function() {
    if ($scope.forms.verificationPass.$valid) {
      $log.debug("datos ok");
      changePass();
    } else {
      $log.debug("formulario incorrecto");
    }
  }

  function changePass() {
    AnalyticsService.evento($rootScope.translation.PAGE_VERIFICATION_PASS, $rootScope.translation.GA_PUSH_CHANGE_YOUR_PASS);
    var newPass = $scope.forms.verificationPass.newPass.$modelValue;
    var repeatNewPass = $scope.forms.verificationPass.repeatNewPass.$modelValue;
    var rut = DataMapService.getItem('verification_step_1_rut');
    // var code = DataMapService.getItem('verification_step_1_code');
    var code = $scope.forms.verificationPass.code.$modelValue;
    $ionicLoading.show({
      template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
    });
    AccessService.changePasswordNoAuth(rut, newPass, repeatNewPass, code).then(function(success) {
      PopupService.openModal('info', $rootScope.translation.ATTENTION_MODAL_TITLE, $rootScope.translation.SUCCESS_PROFILE_CHANGE, $scope, function() {
        $state.go("guest.login");
        $scope.modal.hide();
      });
    }, function(err) {
      AnalyticsService.evento($rootScope.translation.PAGE_VERIFICATION_PASS, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.CHANGE_YOUR_PASS + "-" + err.message + "-" + err.analyticsCode); //Analytics 
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

  $scope.regenerateCode = function() {
    AnalyticsService.evento($rootScope.translation.PAGE_VERIFICATION_PASS, $rootScope.translation.GA_PUSH_REGENERATE_CODE);
    var userId;
    try {
      userId = DataMapService.getItem('verification_step_1_rut', false);
    } catch (e) {
      $log.debug("no es posible obtener user_id");
      var modalType = 'info';
      var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
      var modalContent = $rootScope.translation.NOT_POSSIBLE_GET_USER;
      PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
        $scope.modal.hide();
      });
      return;
    }

    $ionicLoading.show({
      template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
    });
    var formatedRutNumber = userId;
    AccessService.requestPasswordChangeCode(formatedRutNumber).then(function(success) {
      $ionicLoading.hide();
      var modalType = 'info';
      var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
      var message = $rootScope.translation.SUCCESS_CODE_SENT;
      PopupService.openModal(modalType, modalTitle, message, $scope, function() {
        $scope.modal.hide();
      });
    }, function(err) {
      AnalyticsService.evento($rootScope.translation.PAGE_VERIFICATION_PASS, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.REGENERATE_CODE + "-" + err.message + "-" + err.analyticsCode); //Analytics 
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
    $log.info("reseteando VerificationPass");
    $scope.forms.verificationPass.newPass.$viewValue = '';
    $scope.forms.verificationPass.newPass.$render();
    $scope.forms.verificationPass.repeatNewPass.$viewValue = '';
    $scope.forms.verificationPass.repeatNewPass.$render();
    $scope.forms.verificationPass.code.$viewValue = '';
    $scope.forms.verificationPass.code.$render();
    $scope.forms.verificationPass.$setPristine();
  }

  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion);
  }

  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('guest/verificationStepTwo') > -1) {
      AnalyticsService.pantalla($rootScope.translation.PAGE_VERIFICATION_PASS);
      $ionicScrollDelegate.scrollTop();
      $log.debug("llamando a resetForm verificationStepTwo");
      resetForm();
    }
  });
});