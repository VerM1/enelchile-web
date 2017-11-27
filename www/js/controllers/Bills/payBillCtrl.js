angular.module('BillsModule').controller('payBillCtrl', function($scope, $state, DataMapService, $log, AnalyticsService, $rootScope, $ionicLoading, BillsService, PopupService, ENDPOINTS, $sce, UTILS_CONFIG, LocalStorageProvider, $ionicScrollDelegate) {


  $scope.selectedDebt = {};
  $scope.translation = $rootScope.translation;
  $scope.paymentType_1 = UTILS_CONFIG.PAYMENT_PAYMENTTYPE_1;
  $scope.paymentType_2 = UTILS_CONFIG.PAYMENT_PAYMENTTYPE_2;
  $scope.paymentType_3 = UTILS_CONFIG.PAYMENT_PAYMENTTYPE_3;

  $scope.showThirdElement = false;
  $scope.showSecondElement = false;
  $scope.showFirstElement = false;
  var index = 0;

  function init() {
    $scope.isLogged = $rootScope.isLogged;
    $scope.numeroSuministro = "";
    $scope.numeroSuministroDv = "";
    $scope.direccion = "";
    $scope.comuna = "";
    $scope.items = [];

    try {
      var assetObject = DataMapService.getItem("payBillObject");
      $log.debug("payBillObjects: ", assetObject);
      if (assetObject) {
        $scope.numeroSuministro = assetObject.numeroSuministro;
        $scope.numeroSuministroDv = assetObject.numeroSuministroDv;
        $scope.direccion = assetObject.direccion;
        if (assetObject.comuna) {
          $scope.comuna = assetObject.comuna;
        }
        $scope.items = assetObject.items;
        index = assetObject.index;
        $log.debug("largo array: ", $scope.items.length);
        if ($scope.items[2]) {
          $scope.payBill = assetObject.items[2].monto;
          $scope.selectedDebt = assetObject.items[2];
          $scope.showThirdElement = true;
          $scope.showSecondElement = true;
          $scope.showFirstElement = true;
        } else if ($scope.items[1]) {
          $scope.payBill = assetObject.items[1].monto;
          $scope.selectedDebt = assetObject.items[1];
          $scope.showThirdElement = false;
          $scope.showSecondElement = true;
          $scope.showFirstElement = true;
        } else if ($scope.items[0]) {
          $scope.payBill = assetObject.items[0].monto;
          $scope.selectedDebt = assetObject.items[0];
          $scope.showThirdElement = false;
          $scope.showSecondElement = false;
          $scope.showFirstElement = true;
        }

        $log.debug("$scope.showThirdElement", $scope.showThirdElement);
        $log.debug("$scope.showSecondElement", $scope.showSecondElement);
        $log.debug("$scope.showFirstElement", $scope.showFirstElement);
      }
    } catch (err) {
      $log.debug("Error: ", err);
    }
  }


  $scope.forms = {};

  $scope.validateForm = function() {
    if ($scope.forms.payBillForm.$valid) {
      AnalyticsService.evento($rootScope.translation.PAGE_PAYMENT, $rootScope.translation.GA_PUSH_PAY_BILL);
      $log.debug("formulario OK");

      var formData = LocalStorageProvider.getLocalStorageItem('no_session_form_data');
      if (formData) {
        if (!force.isAuthenticated()) {
          formData.email = $scope.forms.payBillForm.email.$viewValue;
        }

      } else {
        if (!force.isAuthenticated()) {
          formData = {
            email: $scope.forms.payBillForm.email.$viewValue
          };
        }
      }
      LocalStorageProvider.setLocalStorageItem('no_session_form_data', formData);

      //GENERACION DE XML PARA PAGO
      var requestXmlPayment = {};
      requestXmlPayment.amount = $scope.selectedDebt.monto;
      requestXmlPayment.paymentType = $scope.selectedDebt.tipoDeuda;
      requestXmlPayment.email = $scope.forms.payBillForm.email.$viewValue;
      $scope.email = $scope.forms.payBillForm.email.$viewValue;
      requestXmlPayment.expirationDate = $scope.selectedDebt.fechaVencimiento;
      requestXmlPayment.issueDate = $scope.selectedDebt.fechaEmision;
      requestXmlPayment.onClickDate = moment().format("DD/MM/YYYY HH:mm:ss");
      requestXmlPayment.barcode = $scope.selectedDebt.codigoBarra;
      requestXmlPayment.rut = "11111111-1";
      requestXmlPayment.name = "Nombre";
      if ($scope.isLogged) {
        if (LocalStorageProvider.getLocalStorageItem("USER_DATA", false)) {
          var userData = LocalStorageProvider.getLocalStorageItem("USER_DATA", false)
          requestXmlPayment.rut = userData.rut;
          requestXmlPayment.name = userData.nombre;
        }
      }
      $ionicLoading.show({
        template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
      });
      $scope.selectedTrxId = $scope.selectedDebt.trxId;

      BillsService.generateXmlPayment(requestXmlPayment).then(function(response) {
        $ionicLoading.hide();
        $log.debug("conversion exitosa de XML");
        var modalType = 'payment';
        var modalTitle = $rootScope.translation.VALIDATION_MODAL_TITLE;
        var modalContent = {};
        modalContent.url = $sce.trustAsResourceUrl(ENDPOINTS.ENDPOINTS_PAYMENT);
        modalContent.xml = response;
        PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
          $scope.modal.remove()
            .then(function() {
              $scope.modal = null;
              if ($scope.isLogged) {
                $state.go("session.usage");
              } else {
                $state.go("guest.home");
              }
            });
        });
      }, function(err) {
        $ionicLoading.hide();
        AnalyticsService.evento($rootScope.translation.PAGE_PAYMENT, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.GENERATE_XML_PAYMENT + "-" + err.message + "-" + err.analyticsCode); //Analytics 
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
              if ($scope.isLogged) {
                $state.go("session.usage");
              } else {
                $state.go("guest.home");
              }
            });
        });
      });

    } else {
      $log.debug("formulario incorrecto");
    }
  }


  //METOD TYPE OF DEBT
  $scope.selectItem = function(index) {
    $log.debug("valor de index: ", index);
    $scope.selectedDebt = $scope.items[index];
  }



  $scope.generateTemplateBill = function(typeModal, url) {
    if (LocalStorageProvider.getLocalStorageItem("asset_debt_" + index)) {
      LocalStorageProvider.getLocalStorageItem("asset_debt_" + index);
    }
    if (LocalStorageProvider.getLocalStorageItem("asset_detail_" + index)) {
      LocalStorageProvider.removeLocalStorageItem("asset_detail_" + index)
    }

    var trxidDecode = $scope.selectedTrxId;
    var successCode = "false";
    var urlAux = url.split("?")[1];
    urlAux = decodeURIComponent(urlAux);
    var responseParameters = (urlAux).split("&");
    var parameterMap = [];
    for (var i = 0; i < 2; i++) {
      parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
    }
    if (parameterMap.idTransaccion !== undefined && parameterMap.idTransaccion !== null) {
      var base64 = parameterMap.idTransaccion;
      var words = CryptoJS.enc.Base64.parse(base64);
      trxidDecode = CryptoJS.enc.Utf8.stringify(words);
    } else {
      $log.error("Imposible to finde trxid");
    }

    if (parameterMap.exito !== undefined && parameterMap.exito !== null) {
      successCode = parameterMap.exito.toString();
    } else {
      $log.error("Imposible to finde success code");
    }

    $scope.modal.remove()
      .then(function() {
        $scope.modal = null;
      });
    $ionicLoading.show({
      template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
    });
    BillsService.generateTemplateBill(trxidDecode, $scope.numeroSuministro, $scope.email, successCode).then(function(response) {
      $ionicLoading.hide();
      $log.debug("generacion exitosa de template de la boleta");
      var modalType = typeModal;
      var modalTitle = "";
      var modalContent = "";
      if (typeModal == "successPayment") {
        modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
        modalContent = {};
        modalContent.numeroCliente = $scope.numeroSuministroDv;
        modalContent.monto = $scope.selectedDebt.monto;
        modalContent.direccion = $scope.direccion;
        modalContent.comuna = $scope.comuna;
        modalContent.numeroTransaccion = response.IdTransaccionComercial;
        modalContent.canalPago = response.nombreBanco;
        modalContent.fecha = response.fechaOnClick;
        modalContent.mensaje = response.mensaje;
        modalContent.rrss = UTILS_CONFIG.PAYMENT_RRSS_IMAGE;
      } else {
        modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
        modalContent = $rootScope.translation.INCOMPLETE_PAYMENT;
      }

      PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
        $scope.modal.remove()
          .then(function() {
            $scope.modal = null;
            if ($scope.isLogged) {
              $state.go("session.usage");
            } else {
              $state.go("guest.home");
            }
          });
      });
    }, function(err) {
      $ionicLoading.hide();
      AnalyticsService.evento($rootScope.translation.PAGE_PAYMENT, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.GENERATE_TEMPLATE_BILL + "-" + err.message + "-" + err.analyticsCode); //Analytics 
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
            if ($scope.isLogged) {
              $state.go("session.usage");
            } else {
              $state.go("guest.home");
            }
          });
      });
    });
  }


  function resetForm() {
    $log.info("reseteando Pay Bill");
    var formData = LocalStorageProvider.getLocalStorageItem('no_session_form_data');
    if (!force.isAuthenticated() && formData) {
      $scope.forms.payBillForm.email.$setViewValue(formData.email);
    } else if (force.isAuthenticated()) {
      var userData = LocalStorageProvider.getLocalStorageItem('USER_DATA');
      if (userData) {
        $scope.forms.payBillForm.email.$setViewValue(userData.email);
      } else {
        $scope.forms.payBillForm.email.$setViewValue('');
      }
    } else {
      $scope.forms.payBillForm.email.$setViewValue('');
    }
    $scope.forms.payBillForm.email.$render();
    $scope.forms.payBillForm.$setPristine();
  }

  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion);
  }

  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('guest/payBill') > -1 || n.indexOf('session/payBill') > -1) {
      $log.debug("llamando a resetForm Pay Bill");
      AnalyticsService.pantalla($rootScope.translation.PAGE_PAYMENT);
      $ionicScrollDelegate.scrollTop();
      resetForm();
      init();
    }
  });
});