angular.module('AccessModule').controller('homeCtrl', function($scope, $state, $ionicLoading, AccessService, DataMapService, $rootScope, $log, LocalStorageProvider, ENDPOINTS, $sce, PopupService, AnalyticsService, UTILS_CONFIG, BillsService, $ionicScrollDelegate) {

  $rootScope.isReportNotLogged = false;

  //ELEMENTO DE STATE QUE DETERMINA EL BOTON SELECCIONADO
  $scope.buttons = {
    chosen: ""
  };

  //MÉTODO ANALYTICS
  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
  };

  //DECLARACION DEL OBJETO DEL FORMULARIO
  $scope.forms = {};

  //VALIDADOR DE FORMULARIO
  $scope.validateForm = function() {
    if ($scope.forms.homeForm.$valid) {
      var item = $scope.buttons.chosen;
      $log.debug("item: ", item);
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
          AnalyticsService.evento($rootScope.translation.PAGE_HOME, $rootScope.translation.GA_PUSH_PAY_BILL); //Analytics  
          BillsService.paymentStatus(clientNum).then(function(response) {
            if (response.paymentInProgress.toUpperCase() === 'N') {
              AccessService.getDebtData(clientNum).then(function(response) {
                var assetDebt = {};
                var aux = {};
                aux = _.find(response, function(o) {
                  return o.tipoDeuda === UTILS_CONFIG.PAYMENT_PAYMENTTYPE_1;
                });
                if (!_.isEmpty(aux)) {
                  assetDebt = aux;
                }
                aux = _.find(response, function(o) {
                  return o.tipoDeuda === UTILS_CONFIG.PAYMENT_PAYMENTTYPE_2;
                });
                if (!_.isEmpty(aux)) {
                  assetDebt = aux;
                }
                aux = _.find(response, function(o) {
                  return o.tipoDeuda === UTILS_CONFIG.PAYMENT_PAYMENTTYPE_3;
                });
                if (!_.isEmpty(aux)) {
                  assetDebt = aux;
                }


                var num = parseInt(assetDebt.monto, 10);
                $log.debug("valor a pagar: ", num);
                if (assetDebt.monto != null && assetDebt.monto != '0' && num > 0) {
                  $ionicLoading.hide();
                  var assetData = {};
                  assetData.numeroSuministro = clientNum;
                  assetData.numeroSuministroDv = formatedClientNumber;
                  assetData.direccion = assetDebt.direccion;
                  assetData.comuna = "";
                  if (assetDebt.comuna) {
                    assetData.comuna = assetDebt.comuna;
                  }
                  assetData.items = response;
                  assetData.index = 0;
                  DataMapService.setItem("payBillObject", assetData);
                  if (!$rootScope.isLogged) {
                    LocalStorageProvider.setLocalStorageItem('no_session_client_number', formatedClientNumber);
                  }
                  $state.go('guest.payBill');
                } else {
                  // AnalyticsService.evento($rootScope.translation.PAGE_HOME, $rootScope.translation.GA_SUCCESS_SERVICES_RESPONSE + "-" + $rootScope.translation.PAYMENT + "-" + $rootScope.translation.NO_ACTIVE_DEBT); //Analytics  
                  $log.debug("Error: ammount is null or 0");
                  $ionicLoading.hide();
                  var modalType = 'info';
                  var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
                  var modalContent = $rootScope.translation.NO_ACTIVE_DEBT;
                  PopupService.openModal(modalType, modalTitle, modalContent, $scope);
                }
              }, function(err) {
                AnalyticsService.evento($rootScope.translation.PAGE_HOME, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.GET_DEBT + "-" + err.message + "-" + err.analyticsCode); //Analytics 
                $log.error("Error: ", err);
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
              // AnalyticsService.evento($rootScope.translation.PAGE_HOME, $rootScope.translation.GA_SUCCESS_SERVICES_RESPONSE + "-" + $rootScope.translation.AMOUNT + "-" + $rootScope.translation.PAYMENT_IN_PROGRESS); //Analytics 
              var modalType = 'info';
              var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
              var modalContent = $rootScope.translation.PAYMENT_IN_PROGRESS;
              PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
                $scope.modal.remove()
                  .then(function() {
                    $scope.modal = null;
                  });
              });
            }
          }, function(err) {
            AnalyticsService.evento($rootScope.translation.PAGE_HOME, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.PAYMENT_IN_PROGRESS + "-" + err.message + "-" + err.analyticsCode); //Analytics 
            var modalType = 'error';
            if (err.code && err.code.toString() == UTILS_CONFIG.ERROR_INFO_CODE) {
              modalType = 'info';
            }
            var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
            var modalContent = err.message;
            PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
              $scope.modal.remove()
                .then(function() {
                  $scope.modal = null;
                });
            });
          });
          break;
        case 'reportButton':
          AnalyticsService.evento($rootScope.translation.PAGE_HOME, $rootScope.translation.GA_PUSH_BLACKOUT_REPORT); //Analytics
          AccessService.getCommercialData(clientNum).then(function(response) {
            $log.debug("no tiene corte");
            $ionicLoading.hide();
            DataMapService.setItem("uniqueAsset", "home");
            var data = {};
            data.index = 0;
            data.direccion = response.direccion;
            data.comuna = "";
            if (response.comuna) {
              data.comuna = response.comuna;
            }
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
            AnalyticsService.evento($rootScope.translation.PAGE_HOME, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.REPORT_EMERGENCY + "-" + err.message + "-" + err.analyticsCode); //Analytics 
            $log.error("Error: ", err);
            $ionicLoading.hide();
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

  //LIMPIEZA DE FORMULARIO
  function resetForm() {
    $log.debug("reseteando Home");
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
      $log.debug("no existe formulario aun");
    }
  }

  //  BUSQUEDA DE USUARIO
  $scope.searchClientId = function() {
    AnalyticsService.evento($rootScope.translation.PAGE_HOME, $rootScope.translation.GA_PUSH_SEARCH_CLIENT); //Analytics
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
    AnalyticsService.evento($rootScope.translation.PAGE_HOME, $rootScope.translation.GA_PUSH_HELP_CLIENT_NUMBER); //Analytics
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

  //login
  $scope.login = function() {
    AnalyticsService.evento($rootScope.translation.PAGE_HOME, $rootScope.translation.GA_PUSH_LOGIN); //Analytics
    $state.go("guest.login");
  }

  //REGISTRO PARA NEOL
  $scope.registerNeol = function() {
    AnalyticsService.evento($rootScope.translation.PAGE_HOME, $rootScope.translation.GA_PUSH_REGISTER); //Analytics
    var modalType = 'iframe';
    var modalTitle = $rootScope.translation.HELPER_MODAL_TITLE;
    var modalContent = $sce.trustAsResourceUrl(ENDPOINTS.ENDPOINTS_EXTERNAL_REGISTER_NEOL);

    $ionicLoading.show({
      template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
    });
    PopupService.openModal(modalType, modalTitle, modalContent, $scope);
  }


  //EVENTO DE CAMBIO DE STATE
  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('guest/home') > -1) {
      AnalyticsService.pantalla($rootScope.translation.PAGE_HOME);
      $ionicScrollDelegate.scrollTop();
      $log.debug("llamando a resetForm Home");
      resetForm();
    }
  });

});