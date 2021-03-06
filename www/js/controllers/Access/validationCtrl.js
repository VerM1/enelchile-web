angular.module('AccessModule').controller('validationCtrl', function($state, $scope, $log, AccessService, DataMapService, $rootScope, PopupService, $ionicLoading, UTILS_CONFIG, AnalyticsService, $ionicScrollDelegate) {

  $scope.forms = {};

  //MÉTODO ANALYTICS -- 05-07-2017
  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
  };

  $scope.validateForm = function() {
    if ($scope.forms.activateAccount.$valid) {
      $log.debug("formulario ok");
      validateUser();
    } else {
      $log.debug("formulario incorrecto");
    }
  }

  function validateUser() {
    AnalyticsService.evento($rootScope.translation.PAGE_VALIDATION, $rootScope.translation.GA_PUSH_VALIDATE_USER);
    var userId;
    try {
      userId = DataMapService.getItem('new_user_id', false);
    } catch (e) {
      // $ionicLoading.hide();
      $log.debug("no es posible obtener user_id");
      var modalType = 'info';
      var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
      var modalContent = $rootScope.translation.NOT_POSSIBLE_GET_USER;
      PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
        $scope.modal.hide();
      });
      $log.debug("no es posible obtener new:user_id");
      return;
    }
    $ionicLoading.show({
      template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
    });
    AccessService.validateUser(userId, $scope.forms.activateAccount.insertCode.$viewValue).then(function(success) {
      $ionicLoading.hide();
      $log.debug(success);
      var modalType = 'info';
      var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
      var modalContent = $rootScope.translation.SUCCESS_USER_VALIDATED;
      PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
        $state.go("guest.login");
        $scope.modal.hide();
      });
    }, function(err) {
      $ionicLoading.hide();
      AnalyticsService.evento($rootScope.translation.PAGE_VALIDATION, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.VALIDATE_USER + "-" + err.message + "-" + err.analyticsCode); //Analytics 
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
    AnalyticsService.evento($rootScope.translation.PAGE_VALIDATION, $rootScope.translation.GA_PUSH_REGENERATE_CODE);
    var userId;
    try {
      userId = DataMapService.getItem('verification_step_1_rut', false);
    } catch (e) {
      $log.debug("no es posible obtener rut_id");
      var modalType = 'info';
      var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
      var modalContent = $rootScope.translation.NOT_POSSIBLE_GET_USER_RUT;
      PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
        $scope.modal.hide();
      });
      return;
    }
    $ionicLoading.show({
      template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
    });
    var formatedRutNumber = DataMapService.getItem('verification_step_1_rut');
    AccessService.requestPasswordChangeCode(formatedRutNumber).then(function(success) {
      $ionicLoading.hide();
      var modalType = 'info';
      var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
      var message = $rootScope.translation.SUCCESS_CODE_SENT;
      PopupService.openModal(modalType, modalTitle, message, $scope, function() {
        $scope.modal.hide();
      });
    }, function(err) {
      AnalyticsService.evento($rootScope.translation.PAGE_VALIDATION, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.REGENERATE_CODE + "-" + err.message + "-" + err.analyticsCode); //Analytics 
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
    $log.debug("reseteando Validation");
    $scope.forms.activateAccount.insertCode.$viewValue = '';
    $scope.forms.activateAccount.insertCode.$render();
    $scope.forms.activateAccount.$setPristine();
  }

  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('guest/validation') > -1) {
      AnalyticsService.pantalla($rootScope.translation.PAGE_VALIDATION);
      $ionicScrollDelegate.scrollTop();
      $log.debug("llamando a resetForm Validation");
      resetForm();
    }
  });

});