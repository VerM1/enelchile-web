angular.module('CoreModule').controller('preBlackoutCtrl', function($scope, $state, $ionicModal, $ionicLoading, AccessService, DataMapService, $rootScope, $log, LocalStorageProvider, PopupService, $sce, ENDPOINTS, AnalyticsService, UTILS_CONFIG, $ionicScrollDelegate) {

  $scope.buttons = {
    chosen: ""
  };

  $scope.forms = {};

  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
  };


  $scope.validateForm = function() {
    $rootScope.isReportNotLogged = false;
    $log.debug("isReportNotLogged: " + $rootScope.isReportNotLogged);
    if ($scope.forms.preBlackoutForm.$valid) {
      var item = $scope.buttons.chosen;
      var numAux = $scope.forms.preBlackoutForm.clientNum.$viewValue;
      var n = 0;
      if (numAux.indexOf("-") > -1) {
        n = numAux.indexOf("-");
      } else {
        n = numAux.length - 1;
      }
      var clientNum = numAux.substring(0, n);
      var formatedClientNumber = clientNum + "-" + numAux.substr(numAux.length - 1);
      $ionicLoading.show({
        template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
      });
      switch (item) {
        case 'consultButton':
          AnalyticsService.evento($rootScope.translation.PAGE_PRE_BLACKOUT + " - " + $rootScope.translation.GA_STEP_01, $rootScope.translation.GA_PUSH_BLACKOUT_REPORT);
          AccessService.getCommercialData(clientNum).then(function(response) {
            $log.debug("no tiene corte");
            $ionicLoading.hide();
            DataMapService.setItem("uniqueAsset", "preBlackout");
            var data = {};
            data.index = 0;
            data.direccion = response.direccion;
            data.numeroSuministro = response.numeroSuministro;
            data.numeroSuministroDv = response.numeroSuministro + "-" + response.digitoVerificador;
            DataMapService.setItem("reportBlackoutObject", data);
            $rootScope.isReportNotLogged = true;
            $log.debug("isReportNotLogged: " + $rootScope.isReportNotLogged);
            if (!$rootScope.isLogged) {
              LocalStorageProvider.setLocalStorageItem('no_session_client_number', formatedClientNumber);
            }
            $state.go('guest.blackout');
          }, function(err) {
            $log.error("Error: ", err);
            $ionicLoading.hide();
            AnalyticsService.evento($rootScope.translation.PAGE_PRE_BLACKOUT, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.REPORT_EMERGENCY + "-" + err.message + "-" + err.analyticsCode); //Analytics 
            var modalType = 'error';
            if (err.code && err.code.toString() == UTILS_CONFIG.ERROR_INFO_CODE) {
              modalType = 'info';
            }
            var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
            var modalContent = err.message;
            PopupService.openModal(modalType, modalTitle, modalContent, $scope);
          });
          break;
        default:
          break;
      }
    } else {
      $log.debug("formulario incorrecto");
    }
  }


  function resetForm() {
    $log.debug("reseteando Pre Blackout");
    $scope.forms.preBlackoutForm.$setPristine();
    var clientnum = LocalStorageProvider.getLocalStorageItem('no_session_client_number');
    if (clientnum && !$rootScope.isLogged) {
      $scope.forms.preBlackoutForm.clientNum.$setViewValue(clientnum);
    } else {
      $scope.forms.preBlackoutForm.clientNum.$viewValue = '';
    }
    $scope.forms.preBlackoutForm.clientNum.$render();
  }


  //  BUSQUEDA DE USUARIO
  $scope.searchClientId = function() {
    AnalyticsService.evento($rootScope.translation.PAGE_PRE_BLACKOUT + " - " + $rootScope.translation.GA_STEP_01, $rootScope.translation.GA_PUSH_SEARCH_CLIENT);
    var modalType = 'iframe';
    var modalTitle = $rootScope.translation.HELPER_MODAL_TITLE;
    var modalContent = $sce.trustAsResourceUrl(ENDPOINTS.ENDPOINTS_EXTERNAL_SEARCH_CLIENTID);
    PopupService.openModal(modalType, modalTitle, modalContent, $scope);
  }

  //MODAL DE AYUDA SUMINISTRO
  $scope.helpModal = function() {
    AnalyticsService.evento($rootScope.translation.PAGE_PRE_BLACKOUT + " - " + $rootScope.translation.GA_STEP_01, $rootScope.translation.GA_PUSH_HELP_CLIENT_NUMBER);
    var modalType = 'help';
    var modalTitle = $rootScope.translation.HELPER_MODAL_TITLE;
    var modalContent = UTILS_CONFIG.IMAGE_ASSET_MODAL_HELP;
    PopupService.openModal(modalType, modalTitle, modalContent, $scope);
  }


  //DECLARACION DEL OBJETO DE CERRADO DE MODALES
  $scope.closeModal = function() {
    $scope.modal.remove()
      .then(function() {
        $scope.modal = null;
      });
  };



  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('guest/preBlackout') > -1) {
      AnalyticsService.pantalla($rootScope.translation.PAGE_PRE_BLACKOUT);
      $ionicScrollDelegate.scrollTop();
      $log.debug("llamando a resetForm Pre Blackout");
      resetForm();
    }
  });

});