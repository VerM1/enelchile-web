angular.module('AccessModule').controller('verificationCtrl', function($state, $scope, $log, LocalStorageProvider, DataMapService, $rootScope, PopupService, AccessService, $ionicLoading, UTILS_CONFIG) {

  $scope.forms = {};

  $scope.formValidationStep1 = function() {
    if ($scope.forms.step1Verification.$valid) {
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
        var modalTitle = $rootScope.translation.HELPER_MODAL_TITLE;
        var message = $rootScope.translation.SUCCESS_CODE_SENT;
        PopupService.openModal(modalType, modalTitle, message, $scope, function() {
          DataMapService.setItem('verification_step_1_rut', formatedRutNumber);
          $state.go('guest.verificationPass');
          $scope.modal.hide();
        });
      }, function(err) {
        var modalType = 'error';
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



  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('guest/verification') > -1) {
      $log.debug("llamando a resetForm Verification");
      resetForm();
    }
  });


});