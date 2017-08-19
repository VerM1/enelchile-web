angular.module('AccessModule').controller('homeCtrl', function($scope, $state, $ionicLoading, AccessService, DataMapService, $rootScope, $log, LocalStorageProvider, ENDPOINTS, $sce, PopupService, AnalyticsService, UTILS_CONFIG) {

  $rootScope.isReportNotLogged = false;

  //ELEMENTO DE STATE QUE DETERMINA EL BOTON SELECCIONADO
  $scope.buttons = {
    chosen: ""
  };

  //DECLARACION DEL OBJETO DEL FORMULARIO
  $scope.forms = {};

  //INICIALIZADOR DE ELEMENTOS AL CARGAR EL CONTROLADOR
  function init() {
    resetForm();
  }

  //MÉTODO ANALYTICS -- 03-07-2017
  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
  };

  //VALIDADOR DE FORMULARIO
  $scope.validateForm = function() {
    if ($scope.forms.homeForm.$valid) {
      var item = $scope.buttons.chosen;
      $log.info("item: ", item);
      var numAux = $scope.forms.homeForm.clientNum.$viewValue;
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
        case 'payButton':
          AnalyticsService.evento('Inicio', 'Presionar pagar cuenta'); //Analytics  
          AccessService.getDebtData(clientNum).then(function(response) {
            var assetDebt = {};
            if (response.find(findObjectByTypeOfDebt1)) {
              var aux = response.find(findObjectByTypeOfDebt1);
              assetDebt = aux;
            } else if (response.find(findObjectByTypeOfDebt2)) {
              var aux = response.find(findObjectByTypeOfDebt2);
              assetDebt = aux;
            } else if (response.find(findObjectByTypeOfDebt3)) {
              var aux = response.find(findObjectByTypeOfDebt3);
              assetDebt = aux;
            }
            var num = parseInt(assetDebt.monto, 10);
            $log.info("valor a pagar: ", num);
            if (assetDebt.monto != null && assetDebt.monto != '0' && num > 0) {
              $ionicLoading.hide();
              var assetData = {};
              assetData.numeroSuministro = clientNum;
              assetData.numeroSuministroDv = formatedClientNumber;
              assetData.direccion = assetDebt.direccion;
              assetData.items = response;
              assetData.index = 0;
              DataMapService.setItem("payBillObject", assetData);
              if (!$rootScope.isLogged) {
                LocalStorageProvider.setLocalStorageItem('no_session_client_number', formatedClientNumber);
              }
              $state.go('guest.payBill');
            } else {
              $log.debug("Error");
              $ionicLoading.hide();
              var modalType = 'error';
              var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
              var modalContent = $rootScope.translation.NO_ACTIVE_DEBT;
              PopupService.openModal(modalType, modalTitle, modalContent, $scope);
            }
          }, function(err) {
            $log.error("Error: ", err);
            $ionicLoading.hide();
            var modalType = 'error';
            var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
            var modalContent = err.message;
            PopupService.openModal(modalType, modalTitle, modalContent, $scope);
          });
          break;
        case 'reportButton':
          AnalyticsService.evento('Inicio', 'Presionar reportar corte'); //Analytics
          AccessService.getCommercialData(clientNum).then(function(response) {
            $log.info("no tiene corte");
            $ionicLoading.hide();
            DataMapService.setItem("uniqueAsset", true);
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
            var modalType = 'error';
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


  //GET TYPE OF DEBT 1
  function findObjectByTypeOfDebt1(object) {
    return object.tipoDeuda === UTILS_CONFIG.PAYMENT_PAYMENTTYPE_1;
  }

  //GET TYPE OF DEBT 2
  function findObjectByTypeOfDebt2(object) {
    return object.tipoDeuda === UTILS_CONFIG.PAYMENT_PAYMENTTYPE_2;
  }

  //GET TYPE OF DEBT 3
  function findObjectByTypeOfDebt3(object) {
    return object.tipoDeuda === UTILS_CONFIG.PAYMENT_PAYMENTTYPE_3;
  }




  //LIMPIEZA DE FORMULARIO
  function resetForm() {
    $log.info("reseteando Home");
    var clientnum = LocalStorageProvider.getLocalStorageItem('no_session_client_number');
    if ($scope.forms.homeForm) {
      if (clientnum && !$rootScope.isLogged) {
        $scope.forms.homeForm.clientNum.$setViewValue(clientnum);
      } else {
        $scope.forms.homeForm.clientNum.$viewValue = '';
      }
      $scope.forms.homeForm.$setPristine();
      $scope.forms.homeForm.clientNum.$render();
    } else {
      $log.info("no existe formulario aun");
    }
  }

  //  BUSQUEDA DE USUARIO
  $scope.searchClientId = function() {
    AnalyticsService.evento('Inicio', 'Presionar buscar número de cliente'); //Analytics
    var modalType = 'iframe';
    var modalTitle = $rootScope.translation.HELPER_MODAL_TITLE;
    var modalContent = $sce.trustAsResourceUrl(ENDPOINTS.ENDPOINTS_EXTERNAL_SEARCH_CLIENTID);

    $ionicLoading.show({
      template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
    });
    PopupService.openModal(modalType, modalTitle, modalContent, $scope);
  }

  //MODAL DE AYUDA SUMINISTRO
  $scope.helpModal = function() {
    AnalyticsService.evento('Inicio', 'Presionar ayuda número de cliente'); //Analytics
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


  //EVENTO DE CAMBIO DE STATE
  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('guest/home') > -1) {
      $log.debug("llamando a resetForm Home");
      resetForm();
    }
  });

  // $scope.onload = function() {
  //   $log.debug("llamando a resetForm Home");
  //   resetForm();
  // }

});