angular.module('UsageModule').controller('usageCtrl', function($scope, $state, $stateParams, $route, $window, $ionicSlideBoxDelegate, UsageService, $rootScope, $log, $ionicModal, $ionicLoading, DataMapService, PopupService, AccessService, PopupService, $q, AnalyticsService, UtilsService, LocalStorageProvider, UTILS_CONFIG) {

  //NAVIGATION TABS
  //$scope.contactId = $rootScope.contactId;
  $scope.forms = {};
  $scope.orientation;
  $scope.selectedTab = 0;
  $scope.tab0selected = true;
  $scope.tab1selected = false;
  $scope.tab2selected = false;
  $scope.tab3selected = false;
  $scope.selectedIdex = 0;
  $scope.selectedAssetNumber = 0;
  $scope.selectedAssetNumberDv = "";
  $scope.selectedAssetAddress = "";
  $scope.selectedAssetState = "";
  $scope.actualIndex = 0;
  $scope.flagChangeTab = 0;
  $scope.tabAnt = 'Resumen - Resumen';
  $scope.orientaAnt = 0;
  $scope.showRotateIcon = $rootScope.showRotateIcon;
  $scope.UTILS_CONFIG = UTILS_CONFIG;

  //MÉTODO ANALYTICS
  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
  };

  $scope.changeTab = function(tabValue) {
    //Analytics
    if ($scope.tab0selected === true) {
      $scope.tabAnt = 'Resumen - Resumen';
    } else if ($scope.tab1selected === true) {
      $scope.tabAnt = 'Resumen - Consumos';
    } else if ($scope.tab2selected === true) {
      $scope.tabAnt = 'Resumen - Boleta';
    } else if ($scope.tab3selected === true) {
      $scope.tabAnt = 'Resumen - Pagos';
    } else {
      $scope.tabAnt = 'Resumen - Resumen';
    }

    $log.debug("changetab");
    $scope.tab0selected = false;
    $scope.tab1selected = false;
    $scope.tab2selected = false;
    $scope.tab3selected = false;


    switch (tabValue) {
      case 0:
        /*if($scope.flagChangeTab === 0){
           AnalyticsService.evento($scope.tabAnt, 'Presionar Resumen (superior)'); //Analytics
        }*/
        cleanAll();
        $rootScope.tabActualAnalytics = 'Resumen - Resumen';
        $scope.tab0selected = true;
        //$scope.flagChangeTab = 0;
        getAssetDebt($scope.selectedIdex);
        getAssetDetail($scope.selectedIdex);
        break;
      case 1:
        cleanAll();
        AnalyticsService.evento($scope.tabAnt, 'Presionar Consumos)'); //Analytics
        $rootScope.tabActualAnalytics = 'Resumen - Consumos';
        $scope.tab1selected = true;
        getAssetUsage($scope.selectedIdex);
        break;
      case 2:
        cleanAll();
        AnalyticsService.evento($scope.tabAnt, 'Presionar Boletas'); //Analytics
        $rootScope.tabActualAnalytics = 'Resumen - Boletas';
        $scope.tab2selected = true;
        getAssetBills($scope.selectedIdex);
        break;
      case 3:
        cleanAll();
        AnalyticsService.evento($scope.tabAnt, 'Presionar Pagos'); //Analytics
        $rootScope.tabActualAnalytics = 'Resumen - Pagos';
        $scope.tab3selected = true;
        getAssetPayments($scope.selectedIdex);
        break;
      default:
        AnalyticsService.evento($scope.tabAnt, 'Presionar Resumen (superior)'); //Analytics
        $rootScope.tabActualAnalytics = 'Resumen - Resumen';
        $scope.tab0selected = true;
        $scope.selectedIdex = 0;
        getAssetDetail($scope.selectedIdex);
        break;
    }
    $scope.selectedTab = tabValue;
  };


  //HEADER ASSETS LIST
  $scope.dataUsageAssetList = {};
  $scope.dataUsageAssetList.items = [];
  var getAssetList = function() {
    var defer = $q.defer();
    $ionicLoading.show({
      template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
    });
    UsageService.getAssetList().then(function(items) {
        if (items.length > 0) {
          $scope.dataUsageAssetList.items = items;
          $ionicSlideBoxDelegate.update();
          $ionicLoading.hide();
          $scope.changeTab(0);
        } else {
          $log.error("No data");
          $ionicLoading.hide();
          var modalType = 'info';
          var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
          var modalContent = $rootScope.translation.NO_DATA;
          PopupService.openModal(modalType, modalTitle, modalContent, $scope);
        }
      },
      function(err) {
        $log.error('Error AssetList: ', err);
        $ionicLoading.hide();
        var modalType = 'error';
        if (err.code && err.code.toString() == UTILS_CONFIG.ERROR_INFO_CODE) {
          modalType = 'info';
        }
        var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
        var modalContent = err.message;
        PopupService.openModal(modalType, modalTitle, modalContent, $scope);
      });
  };


  //DEBT ASSET 
  $scope.dataUsageAssetDebt = {};
  $scope.dataUsageAssetDebt.items = [];
  $scope.dataUsageAssetDebtToShow = {};
  var getAssetDebt = function(index) {
    $scope.showAssetDebt = false;
    $scope.showLoadingDebt = true;
    $scope.showRetryDebt = false;
    var length = $scope.dataUsageAssetList.items.length;
    if (length > 0) {
      var assetId = $scope.dataUsageAssetList.items[index].numeroSuministro;
      $scope.selectedAssetNumber = assetId;
      $scope.selectedAssetNumberDv = $scope.dataUsageAssetList.items[index].numeroSuministroDv;
      $scope.selectedAssetAddress = $scope.dataUsageAssetList.items[index].direccion;
      if ($scope.dataUsageAssetList.items[index].comuna) {
        $scope.selectedAssetState = $scope.dataUsageAssetList.items[index].comuna;
      }

      UsageService.getAssetDebt(assetId, index).then(function(response) {
          $log.info("reponse debt: ", response);
          $scope.dataUsageAssetDebt.items = response;
          var aux = {};
          if (response.find(findObjectByTypeOfDebt1)) {
            aux = response.find(findObjectByTypeOfDebt1);
            // $scope.dataUsageAssetDebtToShow = aux;
            $scope.showAssetDebt = true;
          } else if (response.find(findObjectByTypeOfDebt2)) {
            aux = response.find(findObjectByTypeOfDebt2);
            $scope.showAssetDebt = true;
            // $scope.dataUsageAssetDebtToShow = aux;                        
          } else if (response.find(findObjectByTypeOfDebt3)) {
            aux = response.find(findObjectByTypeOfDebt3);
            $scope.showAssetDebt = true;
            // $scope.dataUsageAssetDebtToShow = aux;
          }
          $scope.showAssetDebt = true;
          $scope.dataUsageAssetDebtToShow = aux;
          $log.debug("dataUsageAssetDebtToShow: ", $scope.dataUsageAssetDebtToShow);
          $scope.showLoadingDebt = false;
          $scope.showRetryDebt = false;
          $ionicSlideBoxDelegate.update();
        },
        function(err) {
          $scope.showAssetDebt = false;
          $scope.showLoadingDebt = false;
          $scope.showRetryDebt = true;
          $log.error('Error AssetDebt: ', err);
        });
    } else {
      $log.error("No data debt with that AssetId");
      var modalType = 'info';
      var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
      var modalContent = $rootScope.translation.NO_DATA;
      PopupService.openModal(modalType, modalTitle, modalContent, $scope);
    }
  }


  //DETAIL ASSET 
  $scope.dataUsageAssetDetail = {};
  var getAssetDetail = function(index) {
    $scope.showAssetDetail = false;
    $scope.showLoadingDetail = true;
    $scope.showRetryDetail = false;
    var length = $scope.dataUsageAssetList.items.length;
    if (length > 0) {
      var assetId = $scope.dataUsageAssetList.items[index].numeroSuministro;
      $scope.selectedAssetNumber = assetId;
      $scope.selectedAssetNumberDv = $scope.dataUsageAssetList.items[index].numeroSuministroDv;
      $scope.selectedAssetAddress = $scope.dataUsageAssetList.items[index].direccion;
      if ($scope.dataUsageAssetList.items[index].comuna) {
        $scope.selectedAssetState = $scope.dataUsageAssetList.items[index].comuna;
      }
      UsageService.getAssetDetail(assetId, index, $scope.selectedAssetNumberDv, $scope.selectedAssetAddress).then(function(response) {
          $log.info("reponse detalle: ", response);
          $scope.dataUsageAssetDetail = response;
          $scope.showAssetDetail = true;
          $scope.showLoadingDetail = false;
          $scope.showRetryDetail = false;
          $ionicSlideBoxDelegate.update();
        },
        function(err) {
          $log.error('Error AssetDetail: ', err.message);
          $scope.showAssetDetail = false;
          $scope.showLoadingDetail = false;
          $scope.showRetryDetail = true;
        });
    } else {
      $log.error("No data details with that AssetId");
      var modalType = 'info';
      var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
      var modalContent = $rootScope.translation.NO_DATA;
      PopupService.openModal(modalType, modalTitle, modalContent, $scope);
    }
  }

  //USAGE ASSET 
  $scope.dataUsageAssetUsage = {};
  $scope.dataUsageAssetUsage.items = [];
  $scope.dataUsageAssetUsage.graphlabels = [];
  $scope.dataUsageAssetUsage.graphdata = []
  $scope.dataUsageAssetUsage.graphseries = ['CONSUMOS'];
  var getAssetUsage = function(index) {

    var length = $scope.dataUsageAssetList.items.length;
    if (length > 0) {
      var assetId = $scope.dataUsageAssetList.items[index].numeroSuministro;
      $scope.selectedAssetNumber = assetId;
      $scope.selectedAssetNumberDv = $scope.dataUsageAssetList.items[index].numeroSuministroDv;
      $scope.selectedAssetAddress = $scope.dataUsageAssetList.items[index].direccion;
      if ($scope.dataUsageAssetList.items[index].comuna) {
        $scope.selectedAssetState = $scope.dataUsageAssetList.items[index].comuna;
      }
      $ionicLoading.show({
        template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
      });
      UsageService.getAssetUsage(assetId, index).then(function(response) {
          $scope.dataUsageAssetUsage.items = response.items;
          $scope.dataUsageAssetUsage.typeUsage = response.typeUsage;
          $scope.dataUsageAssetUsage.graphlabels = response.graphlabels;
          $scope.dataUsageAssetUsage.graphdata = response.graphdata;
          //
          $scope.dataUsageAssetUsage.graphdataLine = response.graphdataLine;
          $scope.dataUsageAssetUsage.graphlabelsLine = response.graphlabelsLine;
          $scope.dataUsageAssetUsage.graphseriesLine = response.graphseriesLine;
          //
          $scope.dataUsageAssetUsage.dataset = response.dataset;
          $scope.dataUsageAssetUsage.options = response.options;
          $ionicSlideBoxDelegate.update();
          $ionicLoading.hide();
        },
        function(err) {
          $log.error('Error AssetUsage: ', err);
          $ionicLoading.hide();
          var modalType = 'error';
          if (err.code && err.code.toString() == UTILS_CONFIG.ERROR_INFO_CODE) {
            modalType = 'info';
          }
          var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
          var modalContent = err.message;
          PopupService.openModal(modalType, modalTitle, modalContent, $scope);
        });
      // .finally(function() {
      // if (LocalStorageProvider.getLocalStorageItem('asset_usages_' + index)) {
      // $ionicLoading.hide();
      // }
      // });
    } else {
      $log.error("No data usage with that AssetId");
      $ionicLoading.hide();
      var modalType = 'info';
      var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
      var modalContent = $rootScope.translation.NO_DATA;
      PopupService.openModal(modalType, modalTitle, modalContent, $scope);
    }
  }


  //BILLS ASSET
  $scope.dataUsageAssetBills = {};
  $scope.dataUsageAssetBills.items = [];
  $scope.dataUsageAssetBills.graphlabels = [];
  $scope.dataUsageAssetBills.graphdata = []
  $scope.dataUsageAssetBills.graphseries = ['BOLETAS'];
  var getAssetBills = function(index) {

    var length = $scope.dataUsageAssetList.items.length;
    if (length > 0) {
      var assetId = $scope.dataUsageAssetList.items[index].numeroSuministro;
      $scope.selectedAssetNumber = assetId;
      $scope.selectedAssetNumberDv = $scope.dataUsageAssetList.items[index].numeroSuministroDv;
      $scope.selectedAssetAddress = $scope.dataUsageAssetList.items[index].direccion;
      if ($scope.dataUsageAssetList.items[index].comuna) {
        $scope.selectedAssetState = $scope.dataUsageAssetList.items[index].comuna;
      }
      $ionicLoading.show({
        template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
      });
      UsageService.getAssetBills(assetId, index).then(function(response) {
          $scope.dataUsageAssetBills.items = response.items;
          $scope.dataUsageAssetBills.graphlabels = response.graphlabels;
          $scope.dataUsageAssetBills.graphdata = response.graphdata;
          $scope.dataUsageAssetBills.dataset = response.dataset;
          $scope.dataUsageAssetBills.options = response.options;
          $ionicSlideBoxDelegate.update();
          $ionicLoading.hide();
        },
        function(err) {
          $log.error('Error AssetBills: ', err);
          $ionicLoading.hide();
          var modalType = 'error';
          if (err.code && err.code.toString() == UTILS_CONFIG.ERROR_INFO_CODE) {
            modalType = 'info';
          }
          var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
          var modalContent = err.message;
          PopupService.openModal(modalType, modalTitle, modalContent, $scope);
        });
      // .finally(function() {
      // if (LocalStorageProvider.getLocalStorageItem('asset_bills_' + index)) {
      // $ionicLoading.hide();
      // }
      // });
    } else {
      $log.error("No data bills with that AssetId");
      $ionicLoading.hide();
      var modalType = 'info';
      var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
      var modalContent = $rootScope.translation.NO_DATA;
      PopupService.openModal(modalType, modalTitle, modalContent, $scope);
    }
  }



  //PAYMENTS ASSET 
  $scope.dataUsageAssetPayments = {};
  $scope.dataUsageAssetPayments.items = [];
  $scope.dataUsageAssetPayments.graphlabels = [];
  $scope.dataUsageAssetPayments.graphdata = []
  $scope.dataUsageAssetPayments.graphseries = ['PAGOS'];
  var getAssetPayments = function(index) {

    var length = $scope.dataUsageAssetList.items.length;
    if (length > 0) {
      var assetId = $scope.dataUsageAssetList.items[index].numeroSuministro;
      $scope.selectedAssetNumber = assetId;
      $scope.selectedAssetNumberDv = $scope.dataUsageAssetList.items[index].numeroSuministroDv;
      $scope.selectedAssetAddress = $scope.dataUsageAssetList.items[index].direccion;
      if ($scope.dataUsageAssetList.items[index].comuna) {
        $scope.selectedAssetState = $scope.dataUsageAssetList.items[index].comuna;
      }
      $ionicLoading.show({
        template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
      });
      UsageService.getAssetPayments(assetId, index).then(function(response) {
          $scope.dataUsageAssetPayments.items = response.items;
          $scope.dataUsageAssetPayments.graphlabels = response.graphlabels;
          $scope.dataUsageAssetPayments.graphdata = response.graphdata;
          $scope.dataUsageAssetPayments.dataset = response.dataset;
          $scope.dataUsageAssetPayments.options = response.options;
          $ionicSlideBoxDelegate.update();
          $ionicLoading.hide();
        },
        function(err) {
          $log.error('Error AssetPayments: ', err);
          $ionicLoading.hide();
          var modalType = 'error';
          if (err.code && err.code.toString() == UTILS_CONFIG.ERROR_INFO_CODE) {
            modalType = 'info';
          }
          var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
          var modalContent = err.message;
          PopupService.openModal(modalType, modalTitle, modalContent, $scope);
        });
      //     .finally(function() {
      //     if (LocalStorageProvider.getLocalStorageItem('asset_payments_' + index)) {
      //       $ionicLoading.hide();
      //     }
      // });
    } else {
      $log.error("No data payments with that AssetId");
      $ionicLoading.hide();
      var modalType = 'info';
      var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
      var modalContent = $rootScope.translation.NO_DATA;
      PopupService.openModal(modalType, modalTitle, modalContent, $scope);
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



  //RETRY DEBT
  $scope.retryDebt = function() {
    getAssetDebt($scope.selectedIdex);
  }

  //RETRY DETAIL
  $scope.retryDetail = function() {
    getAssetDetail($scope.selectedIdex);
  }

  //Download Bill
  $scope.downloadBill = function(index, boleta, fecha) {
    AnalyticsService.evento($rootScope.tabActualAnalytics, 'Presionar descargar boleta documento ' + (index + 1)); //Analytics

    var length = $scope.dataUsageAssetList.items.length;
    var lengthAssetBills = $scope.dataUsageAssetBills.items.length;
    if (length > 0 && lengthAssetBills > 0) {
      var assetId = $scope.dataUsageAssetList.items[index].numeroSuministro;
      $ionicLoading.show({
        template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
      });

      var bill = boleta;
      var email = "";
      if (LocalStorageProvider.getLocalStorageItem("USER_DATA")) {
        var userData = LocalStorageProvider.getLocalStorageItem("USER_DATA");
        email = userData.email;
      }
      var dateAux = fecha.split("/");
      var month = dateAux[1];

      UsageService.getBillByDate(assetId, bill, email, month).then(function(response) {
          $ionicLoading.hide();
          window.open(response.url, '_system');
        },
        function(err) {
          $log.error('Error Get Bill By Date:: ', err);
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
      $log.error("Imposible to get bill by date with that AssetId");
      $ionicLoading.hide();
      var modalType = 'info';
      var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
      var modalContent = $rootScope.translation.NO_DATA;
      PopupService.openModal(modalType, modalTitle, modalContent, $scope);
    }

  }


  //PAGO DE CUENTA
  $scope.payBill = function() {
    AnalyticsService.evento($rootScope.tabActualAnalytics, 'Presionar pagar cuenta'); //Analytics
    var obj = $scope.dataUsageAssetDebtToShow;
    var num = parseInt(obj.monto, 10);
    $log.info("valor a pagar: ", num);
    if (obj.monto != null && obj.monto != '0' && num > 0) {
      // if (obj.montoUltimaBoleta != null) {
      var assetData = {};
      assetData.numeroSuministro = $scope.selectedAssetNumber;
      assetData.numeroSuministroDv = $scope.selectedAssetNumberDv;
      assetData.direccion = $scope.selectedAssetAddress;
      assetData.comuna = $scope.selectedAssetState;
      assetData.items = $scope.dataUsageAssetDebt.items;
      assetData.index = $scope.selectedIdex;
      DataMapService.setItem("payBillObject", assetData);
      $state.go("session.payBill");
    } else {
      $log.debug("Error");
      var modalType = 'info';
      var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
      var modalContent = $rootScope.translation.NO_ACTIVE_DEBT;
      PopupService.openModal(modalType, modalTitle, modalContent, $scope);
    }



  }

  //SLIDER EVENT
  $scope.pagerClick = function(index) {
    $log.info("se aplica slide button");
    $scope.selectedIdex = index;
    $log.info("$scope.selectedIdex slide: ", $scope.selectedIdex);
    $log.info('anterior: ' + $scope.selectedIdex);
    $log.info('actual: ' + index);
    $ionicSlideBoxDelegate.slide(index);
  };

  //siempre
  $scope.slideHasChanged = function(index) {
    if ($scope.actualIndex < index) {
      AnalyticsService.evento($rootScope.tabActualAnalytics, 'Swipe Right Suministros');
    } else {
      AnalyticsService.evento($rootScope.tabActualAnalytics, 'Swipe Left Suministros');
    } //Fin Analytics

    $scope.actualIndex = index;
    $log.info("se aplica slide slide");
    $scope.selectedIdex = index;
    $log.info("$scope.selectedIdex slide: ", $scope.selectedIdex);
    cleanAll();
    $ionicSlideBoxDelegate.slide(index);
    $scope.changeTab($scope.selectedTab);

  };


  // var _reverseData = function() {
  //     $scope.dataUsageAssetUsage.graphlabels = $scope.dataUsageAssetUsage.graphlabels.reverse();
  //     $scope.dataUsageAssetUsage.graphdata = $scope.dataUsageAssetUsage.graphdata.reverse();

  //     $scope.dataUsageAssetPayments.graphlabels = $scope.dataUsageAssetPayments.graphlabels.reverse();
  //     $scope.dataUsageAssetPayments.graphdata = $scope.dataUsageAssetPayments.graphdata.reverse();

  //     $scope.dataUsageAssetBills.graphlabels = $scope.dataUsageAssetBills.graphlabels.reverse();
  //     $scope.dataUsageAssetBills.graphdata = $scope.dataUsageAssetBills.graphdata.reverse();
  // };

  //ROTATION DEVICE
  var doOnOrientationChange = function() {
    $log.debug('orientation change');
    if ($window.orientation == 90 || $window.orientation == -90) {
      if ($scope.orientaAnt - $window.orientation > 0) {
        AnalyticsService.evento($rootScope.tabActualAnalytics, 'Voltear teléfono a la derecha');
        $scope.orientaAnt = $window.orientation;
      } else {
        AnalyticsService.evento($rootScope.tabActualAnalytics, 'Voltear teléfono a la izquierda');
        $scope.orientaAnt = $window.orientation;
      }

      $log.debug("es orientacion 90");
      // _reverseData();
      $scope.isHorizontal = true;
    } else {
      if ($scope.orientaAnt - $window.orientation > 0) {
        AnalyticsService.evento($rootScope.tabActualAnalytics, 'Voltear teléfono a la derecha');
        $scope.orientaAnt = $window.orientation;
      } else {
        AnalyticsService.evento($rootScope.tabActualAnalytics, 'Voltear teléfono a la izquierda');
        $scope.orientaAnt = $window.orientation;
      }
      $log.debug("es orientacion 180");
      // _reverseData();
      $scope.isHorizontal = false;
    }
    $rootScope.showRotateIcon = false;
    if (!LocalStorageProvider.getLocalStorageItem('show_rotate_icon')) {
      LocalStorageProvider.setLocalStorageItem('show_rotate_icon', "false")
    }
    $scope.showRotateIcon = false;
    $log.debug("current state: " + $state.current.name);
    $route.reload();
  };
  $window.addEventListener('orientationchange', doOnOrientationChange);


  $scope.goToInsertReading = function() {
    DataMapService.setItem('currentUsageIndex', $scope.selectedIdex);
    $state.go('session.enterReading');
  };

  //DECLARACION DEL OBJETO DE CERRADO DE MODALES
  $scope.closeModal = function() {
    $log.debug('unlogging');
    $scope.modal.hide();
    //$scope.$destroy();
    //UsageService.removeUsageData();
    //$state.go('guest.home')
  };

  $scope.addAsset = function() {
    $log.debug("add_asset");
    var modalType = 'addAsset';
    var modalTitle = $rootScope.translation.ADD_ASSET_MODAL_TITLE;
    var modalContent = "";
    PopupService.openModal(modalType, modalTitle, modalContent, $scope);
  }

  $scope.validateFormAddAsset = function() {
    if ($scope.forms.addAssetForm.$valid) {
      $log.info("modal form valido");
    } else {
      $log.info("modal form invalido");
    }
  }

  var cleanAll = function() {
    $scope.dataUsageAssetDetail = {};
    $scope.dataUsageAssetPayments = {};
    $scope.dataUsageAssetPayments.items = [];
    $scope.dataUsageAssetPayments.graphlabels = [];
    $scope.dataUsageAssetPayments.graphdata = []
    $scope.dataUsageAssetPayments.graphseries = ['PAGOS'];
    $scope.dataUsageAssetBills = {};
    $scope.dataUsageAssetBills.items = [];
    $scope.dataUsageAssetBills.graphlabels = [];
    $scope.dataUsageAssetBills.graphdata = []
    $scope.dataUsageAssetBills.graphseries = ['BOLETAS'];
    $scope.dataUsageAssetUsage = {};
    $scope.dataUsageAssetUsage.items = [];
    $scope.dataUsageAssetUsage.graphlabels = [];
    $scope.dataUsageAssetUsage.graphdata = []
    $scope.dataUsageAssetUsage.graphseries = ['CONSUMOS'];
  }

  //LOCATIONCHANGESUCCESS
  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('session/usage') > -1) {
      $log.debug("stateChangeSuccess session/usag");
      // var contactId = $scope.contactId;
      var index = 0;
      cleanAll();
      getAssetList();
    }
  });


  // $scope.$on('$stateChangeSuccess', function(ev, n) {
  //     if (n.name == 'session.usage') {
  //         $log.info("stateChangeSuccess session.usage");
  //         var contactId = $rootScope.contactId;
  //         var index = 0;
  //         getAssetList(contactId);
  //     }
  // });

});