angular.module('BillsModule').controller('payBillCtrl', function($scope, $state, DataMapService, $log, AnalyticsService, $rootScope, $ionicLoading, BillsService, PopupService, ENDPOINTS, $sce, UTILS_CONFIG, LocalStorageProvider) {

  // $scope.checkedItem = false;
  // $scope.showPreviousAmount = false;
  // $scope.showRecentAmount = false;
  // $scope.disablePayButton = true;

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
    $scope.items = [];

    try {
      var assetObject = DataMapService.getItem("payBillObject");
      $log.debug("payBillObjects: ", assetObject);
      if (assetObject) {
        $scope.numeroSuministro = assetObject.numeroSuministro;
        $scope.numeroSuministroDv = assetObject.numeroSuministroDv;
        $scope.direccion = assetObject.direccion;
        $scope.items = assetObject.items;
        index = assetObject.index;
        $log.info("largo array: ", $scope.items.length);
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

        $log.info("$scope.showThirdElement", $scope.showThirdElement);
        $log.info("$scope.showSecondElement", $scope.showSecondElement);
        $log.info("$scope.showFirstElement", $scope.showFirstElement);
      }
    } catch (err) {
      $log.info("Error: ", err);
    }
  }


  $scope.forms = {};

  $scope.validateForm = function() {
    if ($scope.forms.payBillForm.$valid) {
      $log.info("formulario OK");
      var request = {};
      request.amount = $scope.selectedDebt.monto;
      request.paymentType = $scope.selectedDebt.tipoDeuda;
      request.email = $scope.forms.payBillForm.email.$viewValue;
      request.expirationDate = $scope.selectedDebt.fechaVencimiento;
      request.issueDate = $scope.selectedDebt.fechaEmision;
      request.onClickDate = moment().format("DD/MM/YYYY HH:mm:ss");
      request.barcode = $scope.selectedDebt.codigoBarra;
      request.rut = "11111111-1";
      request.name = "Nombre";
      if ($scope.isLogged) {
        if (LocalStorageProvider.getLocalStorageItem("USER_DATA", false)) {
          var userData = LocalStorageProvider.getLocalStorageItem("USER_DATA", false)
          request.rut = userData.rut;
          request.name = userData.nombre;
        }
      }
      $ionicLoading.show({
        template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
      });
      $scope.selectedTrxId = $scope.selectedDebt.trxId;
      BillsService.generateXmlPayment(request).then(function(response) {
        $ionicLoading.hide();
        $log.info("conversion exitosa de XML");
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
                LocalStorageProvider.removeLocalStorageItem("asset_debt_" + index);
                LocalStorageProvider.removeLocalStorageItem("asset_detail_" + index);
                $state.go("session.usage");
              } else {
                $state.go("guest.home");
              }
            });
        });
      }, function(err) {
        $ionicLoading.hide();
        var modalType = 'error';
        var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
        var modalContent = err;
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
      $log.info("formulario incorrecto");
    }
  }


  //METOD TYPE OF DEBT
  $scope.selectItem = function(index) {
    $log.info("valor de index: ", index);
    $scope.selectedDebt = $scope.items[index];
    // $log.info("valor de debt: ", $scope.selectedDebt);
  }



  $scope.generateTemplateBill = function(typeModal, url) {
    var trxidDecode = $scope.selectedTrxId;
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


    $scope.modal.remove()
      .then(function() {
        $scope.modal = null;
      });
    $ionicLoading.show({
      template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
    });

    BillsService.generateTemplateBill(trxidDecode).then(function(response) {
      $ionicLoading.hide();
      $log.info("generacion exitosa de template de la boleta");
      var modalType = typeModal;
      var modalTitle = "";
      var modalContent = "";
      if (typeModal == "successPayment") {
        modalTitle = $rootScope.translation.SUCCESS_MODAL_TITLE;
        modalContent = {};
        modalContent.numeroCliente = $scope.numeroSuministroDv;
        modalContent.monto = $scope.selectedDebt.monto;
        modalContent.direccion = $scope.direccion;
        modalContent.numeroTransaccion = response.IdTransaccionComercial;
        modalContent.canalPago = response.nombreBanco;
        modalContent.fecha = response.fechaOnClick;
        modalContent.mensaje = response.mensaje;
        modalContent.rrss = UTILS_CONFIG.PAYMENT_RRSS_IMAGE;
      } else {
        modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
        modalContent = response.mensaje;
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
      var modalType = 'error';
      var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
      var modalContent = err;
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


  // $scope.selectItem = function(debt) {
  //     $log.info("valor de debt: ", debt);
  //     $scope.selectedDebt = debt;
  // }

  //MÉTODO ANALYTICS -- 05-07-2017
  // $scope.sendAnalytics = function(categoria, accion) {

  //     // sendAnalytics('Paga tu cuenta','Seleccionar Deuda Anterior')

  //     //         AnalyticsService.evento(categoria, accion); //Llamada a Analytics
  // };


  // $scope.setHtml = function() {
  //   var doc = document.getElementById('iframe').contentWindow.document;
  //   doc.open();
  //   doc.write($scope.responseIframe);
  //   doc.close();
  // }





  function resetForm() {
    console.log("reseteando Pay Bill");
    $scope.forms.payBillForm.email.$viewValue = '';
    $scope.forms.payBillForm.email.$render();
    // $scope.forms.payBillForm.payBill.$viewValue = '';
    // $scope.forms.payBillForm.payBill = '';
    //$scope.forms.payBillForm.payBill.$render();
    $scope.forms.payBillForm.$setPristine();
  }

  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('guest/payBill') > -1 || n.indexOf('session/payBill') > -1) {
      $log.debug("llamando a resetForm Pay Bill");
      resetForm();
      init();
    }
  });
});