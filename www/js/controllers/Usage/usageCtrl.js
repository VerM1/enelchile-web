angular.module('UsageModule').controller('usageCtrl', function($scope, $state, $stateParams, $route, $window, $ionicSlideBoxDelegate, UsageService, $rootScope, $log, $ionicModal, $ionicLoading, DataMapService, PopupService, AccessService, PopupService, $q, AnalyticsService, UtilsService, LocalStorageProvider, UTILS_CONFIG, BillsService, $ionicScrollDelegate) {

    //NAVIGATION TABS
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
    $scope.orientaAnt = 0;
    $scope.showRotateIcon = $rootScope.showRotateIcon;
    $scope.UTILS_CONFIG = UTILS_CONFIG;
    $scope.showAssetDebt = false;
    $scope.showLoadingDebt = true;
    $scope.showRetryDebt = false;
    $scope.activeSlide = 0;
    $scope.innerHeightDevice = 0;


    //MÉTODO ANALYTICS
    $scope.sendAnalytics = function(categoria, accion) {
        AnalyticsService.evento(categoria, accion); //Llamada a Analytics
    };

    $scope.changeTab = function(tabValue) {
        $log.debug("changetab");
        $scope.tab0selected = false;
        $scope.tab1selected = false;
        $scope.tab2selected = false;
        $scope.tab3selected = false;
        switch (tabValue) {
            case 0:
                cleanAll();
                AnalyticsService.evento($rootScope.translation.PAGE_USAGE, $rootScope.translation.GA_PUSH_PAGE_USAGE_OVERVIEW);
                AnalyticsService.pantalla($rootScope.translation.PAGE_USAGE_OVERVIEW);
                $ionicScrollDelegate.scrollTop();
                $rootScope.tabActualAnalytics = $rootScope.translation.PAGE_USAGE_OVERVIEW;
                $scope.tab0selected = true;
                getAssetDebt($scope.selectedIdex);
                getAssetDetail($scope.selectedIdex);
                break;
            case 1:
                cleanAll();
                AnalyticsService.evento($rootScope.translation.PAGE_USAGE, $rootScope.translation.GA_PUSH_PAGE_USAGE_USAGES);
                AnalyticsService.pantalla($rootScope.translation.PAGE_USAGE_USAGES);
                $ionicScrollDelegate.scrollTop();
                $rootScope.tabActualAnalytics = $rootScope.translation.PAGE_USAGE_USAGES;
                $scope.tab1selected = true;
                getAssetUsage($scope.selectedIdex);
                break;
            case 2:
                cleanAll();
                AnalyticsService.evento($rootScope.translation.PAGE_USAGE, $rootScope.translation.GA_PUSH_PAGE_USAGE_BILLS);
                AnalyticsService.pantalla($rootScope.translation.PAGE_USAGE_BILLS);
                $ionicScrollDelegate.scrollTop();
                $rootScope.tabActualAnalytics = $rootScope.translation.PAGE_USAGE_BILLS;
                $scope.tab2selected = true;
                getAssetBills($scope.selectedIdex);
                break;
            case 3:
                cleanAll();
                AnalyticsService.evento($rootScope.translation.PAGE_USAGE, $rootScope.translation.GA_PUSH_PAGE_USAGE_PAYMENTS);
                AnalyticsService.pantalla($rootScope.translation.PAGE_USAGE_PAYMENTS);
                $ionicScrollDelegate.scrollTop();
                $rootScope.tabActualAnalytics = $rootScope.translation.PAGE_USAGE_PAYMENTS;
                $scope.tab3selected = true;
                getAssetPayments($scope.selectedIdex);
                break;
            default:
                AnalyticsService.evento($rootScope.translation.PAGE_USAGE, $rootScope.translation.GA_PUSH_PAGE_USAGE_OVERVIEW);
                AnalyticsService.pantalla($rootScope.translation.PAGE_USAGE_OVERVIEW);
                $rootScope.tabActualAnalytics = $rootScope.translation.PAGE_USAGE_OVERVIEW;
                $ionicScrollDelegate.scrollTop();
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
                    if (LocalStorageProvider.getLocalStorageItem("asset_list_is_new_request") && LocalStorageProvider.getLocalStorageItem("asset_list_is_new_request") === "true") {
                        $scope.activeSlide = 0;
                    }
                    $ionicSlideBoxDelegate.slide($scope.activeSlide);
                    $scope.dataUsageAssetList.items = items;
                    $ionicSlideBoxDelegate.update();
                    $ionicLoading.hide();
                    $scope.changeTab(0);
                } else {
                    $log.error("No data");
                    $ionicLoading.hide();
                    AnalyticsService.evento($rootScope.translation.PAGE_USAGE_OVERVIEW, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.GET_ASSETS_LIST + "-" + $rootScope.translation.NO_DATA); //Analytics 
                    var modalType = 'info';
                    var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
                    var modalContent = $rootScope.translation.NO_DATA;
                    PopupService.openModal(modalType, modalTitle, modalContent, $scope);
                }
            },
            function(err) {
                $log.error('Error AssetList: ', err);
                $ionicLoading.hide();
                AnalyticsService.evento($rootScope.translation.PAGE_USAGE_OVERVIEW, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.GET_ASSETS_LIST + "-" + err.message + "-" + err.analyticsCode); //Analytics 
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
                    $log.debug("reponse debt: ", response);
                    $scope.dataUsageAssetDebt.items = response;
                    var aux = {};
                    var assetDebt = {};
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

                    $scope.showAssetDebt = true;
                    $scope.dataUsageAssetDebtToShow = assetDebt;
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
                    AnalyticsService.evento($rootScope.translation.PAGE_USAGE_OVERVIEW, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.GET_DEBT + "-" + err.message + "-" + err.analyticsCode); //Analytics 
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
                    $log.debug("reponse detalle: ", response);
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
                    AnalyticsService.evento($rootScope.translation.PAGE_USAGE_OVERVIEW, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.GET_ASSET_DETAIL + "-" + err.message + "-" + err.analyticsCode); //Analytics 
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
    $scope.dataUsageAssetUsage.graphseries = [];
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

                    $scope.dataUsageAssetUsage.options = response.options;
                    var series = [];
                    if (response.typeUsage != UTILS_CONFIG.USAGE_TYPE_RATE_TYPE_CODE_1) {
                        series.push($rootScope.translation.DAY + "(" + $rootScope.translation.KWH + ")");
                        series.push($rootScope.translation.NIGHT + "(" + $rootScope.translation.KWH + ")");
                        series.push($rootScope.translation.PEAK + "(" + $rootScope.translation.KWH + ")");
                    } else {
                        series.push($rootScope.translation.KWH);
                    }
                    $scope.dataUsageAssetUsage.graphseries = series;
                    $ionicSlideBoxDelegate.update();
                    $ionicLoading.hide();
                },
                function(err) {
                    $log.error('Error AssetUsage: ', err);
                    $ionicLoading.hide();
                    AnalyticsService.evento($rootScope.translation.PAGE_USAGE_USAGES, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.GET_USAGES_LIST + "-" + err.message + "-" + err.analyticsCode); //Analytics 
                    var modalType = 'error';
                    if (err.code && err.code.toString() == UTILS_CONFIG.ERROR_INFO_CODE) {
                        modalType = 'info';
                    }
                    var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
                    var modalContent = err.message;
                    PopupService.openModal(modalType, modalTitle, modalContent, $scope);
                });
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
    $scope.dataUsageAssetBills.graphseries = [];

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
                    $scope.dataUsageAssetBills.options = response.options;
                    var series = [];
                    series.push($rootScope.translation.AMOUNT);
                    $scope.dataUsageAssetBills.graphseries = series;
                    $ionicSlideBoxDelegate.update();
                    $ionicLoading.hide();
                },
                function(err) {
                    $log.error('Error AssetBills: ', err);
                    $ionicLoading.hide();
                    AnalyticsService.evento($rootScope.translation.PAGE_USAGE_BILLS, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.GET_BILLS_LIST + "-" + err.message + "-" + err.analyticsCode); //Analytics 
                    var modalType = 'error';
                    if (err.code && err.code.toString() == UTILS_CONFIG.ERROR_INFO_CODE) {
                        modalType = 'info';
                    }
                    var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
                    var modalContent = err.message;
                    PopupService.openModal(modalType, modalTitle, modalContent, $scope);
                });
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
    $scope.dataUsageAssetPayments.graphseries = [];
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
                    $scope.dataUsageAssetPayments.options = response.options;
                    var series = [];
                    series.push($rootScope.translation.AMOUNT);
                    $scope.dataUsageAssetPayments.graphseries = series;
                    $ionicSlideBoxDelegate.update();
                    $ionicLoading.hide();
                },
                function(err) {
                    $log.error('Error AssetPayments: ', err);
                    $ionicLoading.hide();
                    AnalyticsService.evento($rootScope.translation.PAGE_USAGE_PAYMENTS, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.GET_PAYMENTS_LIST + "-" + err.message + "-" + err.analyticsCode); //Analytics 
                    var modalType = 'error';
                    if (err.code && err.code.toString() == UTILS_CONFIG.ERROR_INFO_CODE) {
                        modalType = 'info';
                    }
                    var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
                    var modalContent = err.message;
                    PopupService.openModal(modalType, modalTitle, modalContent, $scope);
                });
        } else {
            $log.error("No data payments with that AssetId");
            $ionicLoading.hide();
            var modalType = 'info';
            var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
            var modalContent = $rootScope.translation.NO_DATA;
            PopupService.openModal(modalType, modalTitle, modalContent, $scope);
        }
    }

    //RETRY DEBT
    $scope.retryDebt = function() {
        AnalyticsService.evento($rootScope.translation.PAGE_USAGE + " - " + $rootScope.tabActualAnalytics, $rootScope.translation.GA_PUSH_RETRY_GET_DEBT_ASSET);
        getAssetDebt($scope.selectedIdex);
    }

    //RETRY DETAIL
    $scope.retryDetail = function() {
        AnalyticsService.evento($rootScope.translation.PAGE_USAGE + " - " + $rootScope.tabActualAnalytics, $rootScope.translation.GA_PUSH_RETRY_GET_DETAIL_ASSET);
        getAssetDetail($scope.selectedIdex);
    }

    //Download Bill
    $scope.downloadBill = function(index, boleta, fecha) {
        AnalyticsService.evento($rootScope.translation.PAGE_USAGE + " - " + $rootScope.tabActualAnalytics, $rootScope.translation.GA_PUSH_DOWNLOAD_BILL_DOCUMENT + (index + 1));
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
                    AnalyticsService.evento($rootScope.translation.PAGE_USAGE_BILLS, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.DOWNLOAD_BILL + "-" + err.message + "-" + err.analyticsCode); //Analytics 
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
        AnalyticsService.evento($rootScope.translation.PAGE_USAGE + " - " + $rootScope.tabActualAnalytics, $rootScope.translation.GA_PUSH_PAY_BILL);
        $ionicLoading.show({
            template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
        });

        BillsService.paymentStatusAuth($scope.selectedAssetNumber).then(function(response) {
            if (response.paymentInProgress.toUpperCase() === 'N') {
                var obj = $scope.dataUsageAssetDebtToShow;
                var num = parseInt(obj.monto, 10);
                $log.debug("valor a pagar: ", num);
                if (obj.monto != null && obj.monto != '0' && num > 0) {
                    var assetData = {};
                    assetData.numeroSuministro = $scope.selectedAssetNumber;
                    assetData.numeroSuministroDv = $scope.selectedAssetNumberDv;
                    assetData.direccion = $scope.selectedAssetAddress;
                    assetData.comuna = $scope.selectedAssetState;
                    assetData.items = $scope.dataUsageAssetDebt.items;
                    assetData.index = $scope.selectedIdex;
                    DataMapService.setItem("payBillObject", assetData);
                    $ionicLoading.hide();
                    $state.go("session.payBill");
                } else {
                    $ionicLoading.hide();
                    $log.debug("Error");
                    var modalType = 'info';
                    var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
                    var modalContent = $rootScope.translation.NO_ACTIVE_DEBT;
                    PopupService.openModal(modalType, modalTitle, modalContent, $scope);
                }
            } else {
                $ionicLoading.hide();
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
            $ionicLoading.hide();
            AnalyticsService.evento($rootScope.translation.PAGE_USAGE_OVERVIEW, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.PAY_BILL + "-" + err.message + "-" + err.analyticsCode); //Analytics 
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
    }

    //SLIDER EVENT
    $scope.pagerClick = function(index) {
        $scope.activeSlide = index;
        $log.debug("se aplica slide button");
        $scope.selectedIdex = index;
        $log.debug("$scope.selectedIdex slide: ", $scope.selectedIdex);
        $log.debug('anterior: ' + $scope.selectedIdex);
        $log.debug('actual: ' + index);
        $ionicSlideBoxDelegate.slide(index);
    };

    //siempre
    $scope.slideHasChanged = function(index) {
        $scope.activeSlide = index;
        $scope.dataUsageAssetDebtToShow.monto = 0;
        if ($scope.actualIndex < index) {
            AnalyticsService.evento($rootScope.translation.PAGE_USAGE + " - " + $rootScope.tabActualAnalytics, $rootScope.translation.GA_SWIPE_RIGHT);
        } else {
            AnalyticsService.evento($rootScope.translation.PAGE_USAGE + " - " + $rootScope.tabActualAnalytics, $rootScope.translation.GA_SWIPE_LEFT);
        } //Fin Analytics

        $scope.actualIndex = index;
        $log.debug("se aplica slide slide");
        $scope.selectedIdex = index;
        $log.debug("$scope.selectedIdex slide: ", $scope.selectedIdex);
        cleanAll();
        $ionicSlideBoxDelegate.slide(index);
        $ionicSlideBoxDelegate.update();
        $scope.changeTab($scope.selectedTab);
    };

    //ROTATION DEVICE
    var doOnOrientationChange = function() {
        $log.debug('orientation change');
        if ($window.orientation == 90 || $window.orientation == -90) {
            if ($scope.orientaAnt - $window.orientation > 0) {
                AnalyticsService.evento($rootScope.translation.PAGE_USAGE + " - " + $rootScope.tabActualAnalytics, $rootScope.translation.GA_ROTATION_RIGHT);
                $scope.orientaAnt = $window.orientation;
            } else {
                AnalyticsService.evento($rootScope.translation.PAGE_USAGE + " - " + $rootScope.tabActualAnalytics, $rootScope.translation.GA_ROTATION_LEFT);
                $scope.orientaAnt = $window.orientation;
            }
            $log.debug("es orientacion horizontal");
            $scope.isHorizontal = true;

        } else {
            if ($scope.orientaAnt - $window.orientation > 0) {
                AnalyticsService.evento($rootScope.translation.PAGE_USAGE + " - " + $rootScope.tabActualAnalytics, $rootScope.translation.GA_ROTATION_RIGHT);
                $scope.orientaAnt = $window.orientation;
            } else {
                AnalyticsService.evento($rootScope.translation.PAGE_USAGE + " - " + $rootScope.tabActualAnalytics, $rootScope.translation.GA_ROTATION_LEFT);
                $scope.orientaAnt = $window.orientation;
            }
            $log.debug("es orientacion vertical");
            $scope.isHorizontal = false;
        }
        $rootScope.showRotateIcon = false;
        if (!LocalStorageProvider.getLocalStorageItem('show_rotate_icon')) {
            LocalStorageProvider.setLocalStorageItem('show_rotate_icon', "false")
        }
        $scope.showRotateIcon = false;
        $log.debug("current state: " + $state.current.name);
        $route.reload();
        $ionicScrollDelegate.scrollTop();
    };
    $window.addEventListener('orientationchange', doOnOrientationChange);


    $scope.goToInsertReading = function() {
        AnalyticsService.evento($rootScope.translation.PAGE_USAGE, $rootScope.translation.GA_PUSH_INSERT_READING);
        DataMapService.setItem('currentUsageIndex', $scope.selectedIdex);
        $state.go('session.enterReading');
    };

    //DECLARACION DEL OBJETO DE CERRADO DE MODALES
    $scope.closeModal = function() {
        $log.debug('unlogging');
        $scope.modal.hide();
    };

    $scope.goToSendElectronicDocument = function() {
        AnalyticsService.evento($rootScope.translation.PAGE_USAGE, $rootScope.translation.GA_PUSH_SEND_ELECTRONIC_DOCUMENT);
        $log.debug("goToSendElectronicDocument");
        var assetData = {};
        assetData.numeroSuministro = $scope.selectedAssetNumber;
        assetData.numeroSuministroDv = $scope.selectedAssetNumberDv;
        assetData.direccion = $scope.selectedAssetAddress;
        assetData.comuna = $scope.selectedAssetState;
        assetData.index = $scope.selectedIdex;
        DataMapService.setItem("sendElectronicDoc", assetData);
        $state.go("session.sendElectronicDoc");
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


    //OBTIENE LA RESOLUCION DEL DISPOSITIVO
    function getResolutionDevice() {
        $log.debug("ancho de pantalla: ", $window.innerWidth);
        $log.debug("alto de pantalla: ", $window.innerHeight);
        if ($window.innerWidth < $window.innerHeight) {
            $scope.innerHeightDevice = $window.innerWidth;
        } else {
            $scope.innerHeightDevice = $window.innerHeight;
        }
        $log.debug("alto de grafico: ", $scope.innerHeightDevice);
        $scope.innerHeightDevice = $scope.innerHeightDevice - 160;
        $log.debug("nuevo alto de grafico: ", $scope.innerHeightDevice);
    }

    //LOCATIONCHANGESUCCESS
    $scope.$on('$locationChangeSuccess', function(ev, n) {
        if (n.indexOf('session/usage') > -1) {
            AnalyticsService.pantalla($rootScope.translation.PAGE_USAGE);
            $ionicScrollDelegate.scrollTop();
            $log.debug("stateChangeSuccess session/usage");
            var index = 0;
            getResolutionDevice();
            cleanAll();
            getAssetList();
        }
    });
});