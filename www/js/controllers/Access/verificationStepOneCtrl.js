angular.module('AccessModule').controller('verificationStepOneCtrl', function($state, $scope, $log, LocalStorageProvider, DataMapService, $rootScope, PopupService, AccessService, $ionicLoading, UTILS_CONFIG, AnalyticsService, $ionicScrollDelegate) {

  $scope.forms = {};

  //MÉTODO ANALYTICS -- 05-07-2017
  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
  };

  $scope.formValidationStep1 = function() {
    if ($scope.forms.step1Verification.$valid) {
      AnalyticsService.evento($rootScope.translation.PAGE_VERIFICATION, $rootScope.translation.GA_PUSH_SEND_CODE);
      $log.debug("datos ok");
      $ionicLoading.show({
        template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
      });

      var rutAux = $scope.forms.step1Verification.rut.$viewValue;
      var n = 0;
      if (rutAux.indexOf("-") > -1) {
        n = rutAux.indexOf("-");
      } else {
        n = rutAux.length - 1;
      }
      var rutNum = rutAux.substring(0, n);
      var formatedRutNumber = rutNum + "-" + rutAux.substr(rutAux.length - 1);

      AccessService.requestPasswordChangeCode(formatedRutNumber).then(function(success) {
        $ionicLoading.hide();
        var modalType = 'info';
        var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
        var message = $rootScope.translation.SUCCESS_CODE_SENT;
        PopupService.openModal(modalType, modalTitle, message, $scope, function() {
          DataMapService.setItem('verification_step_1_rut', formatedRutNumber);
          $state.go('guest.verificationStepTwo');
          $scope.modal.hide();
        });
      }, function(err) {
        AnalyticsService.evento($rootScope.translation.PAGE_VERIFICATION, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.VERIFICATION + "-" + err.message + "-" + err.analyticsCode); //Analytics 
        var modalType = 'error';
        if (err.code && err.code == UTILS_CONFIG.ERROR_INFO_CODE) {
          modalType = 'info';
        }
        var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
        var modalContent = err.message;
        PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
          $scope.modal.hide();
        });
      });
    } else {
      $log.debug("formulario incorrecto");
    }
  }

  // $scope.formValidationStep2 = function() {
  //     if ($scope.forms.step2Verification.$valid) {
  //         $log.debug("datos ok");
  //         var rutAux = $scope.forms.step1Verification.rut.$viewValue;
  //         var n = 0;
  //         if (rutAux.indexOf("-") > -1) {
  //             n = rutAux.indexOf("-");
  //         } else {
  //             n = rutAux.length - 1;
  //         }
  //         var rutNum = rutAux.substring(0, n);
  //         var formatedRutNumber = rutNum + "-" + rutAux.substr(rutAux.length - 1);
  //         DataMapService.setItem('verification_step_1_rut', formatedRutNumber);
  //         DataMapService.setItem('verification_step_1_code', $scope.forms.step2Verification.code.$modelValue);
  //         $state.go('guest.verificationPass');
  //     } else {
  //         $log.debug("formulario incorrecto");
  //     }
  // }

  function resetForm() {
    $log.debug("reseteando Verification");
    $scope.forms.step1Verification.rut.$viewValue = '';
    $scope.forms.step1Verification.rut.$render();
    // $scope.forms.step2Verification.code.$viewValue = '';
    // $scope.forms.step2Verification.code.$render();
    $scope.forms.step1Verification.$setPristine();
    // $scope.forms.step2Verification.$setPristine();
  }

  $scope.goBack = function() {
    AnalyticsService.evento($rootScope.translation.PAGE_VERIFICATION, $rootScope.translation.GA_PUSH_BACK_BUTTON);
    $state.go("guest.login");
  }



  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('guest/verificationStepOne') > -1) {
      AnalyticsService.pantalla($rootScope.translation.PAGE_VERIFICATION);
      $ionicScrollDelegate.scrollTop();
      $log.debug("llamando a resetForm verificationStepOne");
      resetForm();
    }
  });


});