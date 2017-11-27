angular.module('CoreModule').controller('profileCtrl', function($scope, $state, $ionicModal, $ionicPlatform, $rootScope, $log, AccessService, $ionicLoading, PopupService, $q, ProfileService, LocalStorageProvider, UTILS_CONFIG, UtilsService, AnalyticsService, DataMapService, ManageAssetService, $ionicScrollDelegate) {
    $scope.isIos = false;
    if ($ionicPlatform.is('ios')) {
        $scope.isIos = true;
    }

    $scope.booleanNotifications = false;
    window.sc = $scope;
    $scope.forms = {};
    $scope.xidDevice = $rootScope.xidDevice;
    $scope.listRelationshipWithAsset = [];

    $scope.validateForm1 = function() {
        if ($scope.forms.profileForm1.$valid) {
            AnalyticsService.evento($rootScope.translation.PAGE_PROFILE, $rootScope.translation.GA_PUSH_SAVE_USER_DATA);
            $log.debug("formulario 1 OK");
            var checkNotifications = $scope.forms.profileForm1.checkNotifications.$viewValue;
            var email = $scope.forms.profileForm1.email.$modelValue;
            var cellphone = $scope.forms.profileForm1.cellphone.$modelValue;
            var phone = $scope.forms.profileForm1.phone.$modelValue;
            $ionicLoading.show({
                template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
            });
            ProfileService.updateUserData(checkNotifications, email, cellphone, phone)
                .then(function(success) {
                    var userData = LocalStorageProvider.getLocalStorageItem('USER_DATA');
                    if (userData) {
                        if (checkNotifications == true) {
                            userData.activarNotificaciones = "si";
                        } else {
                            userData.activarNotificaciones = "no";
                        }
                    }
                    userData.email = email;
                    userData.telefonoFijo = phone;
                    userData.telefonoMovil = cellphone;
                    LocalStorageProvider.setLocalStorageItem('USER_DATA', userData);
                    callbackSuccess(success);
                }, callbackError);
        } else {
            $log.debug("formulario incorrecto");
        }
    }


    $scope.validateForm2 = function() {
        if ($scope.forms.profileForm2.$valid) {
            $log.debug("formulario2 OK");
            AnalyticsService.evento($rootScope.translation.PAGE_PROFILE, $rootScope.translation.GA_PUSH_CHANGE_YOUR_PASS);
            if ($scope.forms.profileForm2.password.$modelValue && $scope.forms.profileForm2.newPassword.$modelValue &&
                $scope.forms.profileForm2.password.$modelValue == $scope.forms.profileForm2.newPassword.$modelValue) {
                var password = $scope.forms.profileForm2.password.$modelValue;
                var verifiPassword = $scope.forms.profileForm2.newPassword.$modelValue;
                $ionicLoading.show({
                    template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
                });
                ProfileService.changePassword(password, verifiPassword).then(function(success) {
                    if (LocalStorageProvider.getLocalStorageItem('USER_DATA')) {
                        var userData = LocalStorageProvider.getLocalStorageItem('USER_DATA');
                        userData.password = password;
                        LocalStorageProvider.setLocalStorageItem('USER_DATA', userData);
                    }
                    callbackSuccess(success);
                }, callbackError);


            } else {
                $log.error('contraseñas distintas');
            }
        } else {
            $log.debug("formulario incorrecto");
        }
    }

    $scope.validateForm3 = function() {
        if ($scope.forms.profileForm3.$valid) {
            AnalyticsService.evento($rootScope.translation.PAGE_PROFILE, $rootScope.translation.GA_PUSH_ADD_ASSET);
            $log.debug("formulario3 OK");
            $ionicLoading.show({
                template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
            });
            var numeroSuministro = $scope.forms.profileForm3.clientNum.$viewValue;
            var numeroBoleta = $scope.forms.profileForm3.numLastService.$viewValue;
            var rol = $scope.forms.profileForm3.relationshipWithAsset.$viewValue.value;
            ManageAssetService.addAsset(numeroSuministro, numeroBoleta, rol).then(function(response) {
                $ionicLoading.hide();
                LocalStorageProvider.removeLocalStorageIfStartWith("asset_");
                $state.go("session.usage");

                // DATOS PARA EDE
                // var assetData = {};
                // assetData.numeroSuministro = response.numeroSuministro;
                // assetData.numeroSuministroDv = response.numeroSuministroDv;
                // assetData.direccion = response.direccion;
                // assetData.comuna = response.comuna;
                // assetData.index = "0";
                // DataMapService.setItem("sendElectronicDoc", assetData);
                // $state.go("session.sendElectronicDoc");
            }, function(err) {
                $ionicLoading.hide();
                AnalyticsService.evento($rootScope.translation.PAGE_PROFILE, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.ADD_ASSET + "-" + err.message + "-" + err.analyticsCode); //Analytics 
                $log.error(err);
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
        } else {
            $log.debug("formulario incorrecto");
        }
    }


    var callbackSuccess = function(success) {
        $ionicLoading.hide();
        $log.debug(success);
        var modalType = 'success';
        var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
        var modalContent = success.message;
        PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
            $scope.modal.hide()
                .then(function() {
                    resetForm1();
                    // resetForm2();
                    resetForm3();
                });
        });

    };

    var callbackError = function(err) {
        $ionicLoading.hide();
        AnalyticsService.evento($rootScope.translation.PAGE_PROFILE, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.UPDATE_PROFILE + "-" + err.message + "-" + err.analyticsCode); //Analytics 
        $log.error(err);
        var modalType = 'error';
        if (err.code && err.code.toString() == UTILS_CONFIG.ERROR_INFO_CODE) {
            modalType = 'info';
        }
        var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
        var modalContent = err.message;
        PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
            $scope.modal.hide()
                .then(function() {
                    // resetForm1();
                    // resetForm2();
                    // resetForm3();
                });
        });
    };


    function resetForm1() {
        $log.debug("reseteando Profile");
        if (LocalStorageProvider.getLocalStorageItem("USER_DATA")) {
            var obj = LocalStorageProvider.getLocalStorageItem("USER_DATA");
            if (obj.activarNotificaciones === "si") {
                $scope.booleanNotifications = true;
            }
            $scope.userFullName = obj.nombre + " " + obj.apellidoPaterno + " " + obj.apellidoMaterno;
            $scope.forms.profileForm1.email.$viewValue = obj.email;
            $scope.forms.profileForm1.cellphone.$viewValue = obj.telefonoMovil;
            $scope.forms.profileForm1.phone.$viewValue = obj.telefonoFijo;
        } else {
            $scope.forms.profileForm1.email.$viewValue = '';
            $scope.forms.profileForm1.cellphone.$viewValue = '';
            $scope.forms.profileForm1.phone.$viewValue = '';
        }

        $scope.forms.profileForm1.email.$render();
        $scope.forms.profileForm1.cellphone.$render();
        $scope.forms.profileForm1.phone.$render();
        $scope.forms.profileForm1.$setPristine();
    }


    function resetForm2() {
        $log.debug("reseteando Profile");
        $scope.forms.profileForm2.password.$viewValue = '';
        $scope.forms.profileForm2.newPassword.$viewValue = '';
        $scope.forms.profileForm2.password.$render();
        $scope.forms.profileForm2.newPassword.$render();
        $scope.forms.profileForm2.$setPristine();
    }

    function resetForm3() {
        $log.debug("reseteando Profile");
        $scope.forms.profileForm3.clientNum.$viewValue = '';
        $scope.forms.profileForm3.numLastService.$viewValue = '';
        $scope.forms.profileForm3.relationshipWithAsset.$viewValue = '';
        $scope.forms.profileForm3.clientNum.$render();
        $scope.forms.profileForm3.numLastService.$render();
        $scope.forms.profileForm3.relationshipWithAsset.$render();
        $scope.forms.profileForm3.$setPristine();
    }

    function getRelationshipWithAsset() {
        $log.debug("se procederá a obtener relacion de usuario con el suministro a asociar");
        $scope.listRelationshipWithAsset = [];
        var objTypeOfRelationship1 = {
            value: UTILS_CONFIG.RELATIONSHIP_WITH_ASSET_CODE_1,
            label: $rootScope.translation.RELATIONSHIP_WITH_ASSET_LABEL_1
        };
        var objTypeOfRelationship2 = {
            value: UTILS_CONFIG.RELATIONSHIP_WITH_ASSET_CODE_2,
            label: $rootScope.translation.RELATIONSHIP_WITH_ASSET_LABEL_2
        };
        $scope.listRelationshipWithAsset.push(objTypeOfRelationship1);
        $scope.listRelationshipWithAsset.push(objTypeOfRelationship2);

        $ionicLoading.show({
            template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
        });
        try {
            ProfileService.getRelationshipWithAsset().then(function(response) {
                $log.debug(response);
                $scope.listRelationshipWithAsset = response;
                $ionicLoading.hide();
            }, function(err) {
                $log.error("Error to get Relationship with Asset: ", err);
                $ionicLoading.hide();
                AnalyticsService.evento($rootScope.translation.PAGE_PROFILE, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.GET_RELATIONSHIP_WITH_ASSET + "-" + err.message + "-" + err.analyticsCode); //Analytics 
            });
        } catch (exception) {
            $log.error("Error to get Relationship with Asset: ", exception);
        }

    }


    $scope.$on('$locationChangeSuccess', function(ev, n) {
        if (n.indexOf('session/profile') > -1) {
            AnalyticsService.pantalla($rootScope.translation.PAGE_PROFILE);
            $ionicScrollDelegate.scrollTop();
            $log.debug("llamando a resetForm Profile");
            getRelationshipWithAsset();
            resetForm1();
            // resetForm2();
            resetForm3();
        }
    });

    $scope.logout = function() {
        $log.debug('unlogging');
        var modalType = 'logout';
        var modalTitle = $rootScope.translation.LOGOUT_MODAL_TITLE;
        var modalContent = $rootScope.translation.LOGOUT_MODAL_CONTENT;
        PopupService.openModal(modalType, modalTitle, modalContent, $scope);
    };


    $scope.clearUserData = function() {
        UtilsService.setXID("", "");
        UtilsService.setBadgeNumber(0);
        AccessService.getLogout();
        $state.go('guest.home')
        $scope.modal.remove();
    };

    $scope.closeModal = function() {
        $scope.modal.hide();
    }

    //MÉTODO ANALYTICS
    $scope.sendAnalytics = function(categoria, accion) {
        AnalyticsService.evento(categoria, accion); //Llamada a Analytics
    };

});