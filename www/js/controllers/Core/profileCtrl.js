angular.module('CoreModule').controller('profileCtrl', function($scope, $state, $ionicModal, $rootScope, $log, AccessService, $ionicLoading, PopupService, $q, ProfileService, LocalStorageProvider, UTILS_CONFIG) {
    $scope.booleanNotifications = false;
    window.sc = $scope;
    $scope.forms = {};

    $scope.validateForm1 = function() {
        if ($scope.forms.profileForm1.$valid) {
            $log.info("formulario 1 OK");
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
            $log.info("formulario2 OK");
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


    var callbackSuccess = function(success) {
        $ionicLoading.hide();
        $log.debug(success);
        var modalType = 'success';
        var modalTitle = $rootScope.translation.SUCCESS_MODAL_TITLE;
        var modalContent = success;
        PopupService.openModal(modalType, modalTitle, modalContent, $scope);
    };

    var callbackError = function(err) {
        $ionicLoading.hide();
        $log.error(err);
        var modalType = 'error';
        if (err.code && err.code.toString() == UTILS_CONFIG.ERROR_INFO_CODE) {
            modalType = 'info';
        }
        var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
        var modalContent = err.message;
        PopupService.openModal(modalType, modalTitle, modalContent, $scope);
    };


    function resetForm() {
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
        $scope.forms.profileForm2.password.$viewValue = '';
        $scope.forms.profileForm2.newPassword.$viewValue = '';
        $scope.forms.profileForm1.email.$render();
        $scope.forms.profileForm1.cellphone.$render();
        $scope.forms.profileForm1.phone.$render();
        $scope.forms.profileForm2.password.$render();
        $scope.forms.profileForm2.newPassword.$render();
        $scope.forms.profileForm1.$setPristine();
        $scope.forms.profileForm2.$setPristine();
    }

    $scope.$on('$locationChangeSuccess', function(ev, n) {
        if (n.indexOf('session/profile') > -1) {
            $log.debug("llamando a resetForm Profile");
            resetForm();
        }
    });

    $scope.logout = function() {
        $log.debug('unlogging');
        //$scope.$destroy();
        var modalType = 'logout';
        var modalTitle = $rootScope.translation.LOGOUT_MODAL_TITLE;
        var modalContent = $rootScope.translation.LOGOUT_MODAL_CONTENT;
        PopupService.openModal(modalType, modalTitle, modalContent, $scope);
    };


    $scope.clearUserData = function() {
        AccessService.getLogout();
        $state.go('guest.home')
        $scope.modal.remove();
    };

    $scope.closeModal = function() {
        $scope.modal.remove();
        // $state.go("session.usage");
    };





    // $ionicModal.fromTemplateUrl('views/Modals/logoutModal.html', {
    //     scope: $scope,
    //     /*animation: 'slide-in-up',*/
    //     animation: 'fade',
    // }).then(function(modal) {
    //     $scope.modal = modal;
    // });

    // $scope.openModal = function() {
    //     $scope.modal.show();
    // };

    // $scope.closeModal = function() {
    //     $scope.modal.hide();
    // };

    // //Cleanup the modal when we're done with it!
    // $scope.$on('$destroy', function() {
    //     //$scope.modal.remove();
    // });

    // // Execute action on hide modal
    // $scope.$on('modal.hidden', function() {
    //     // Execute action
    // });

    // // Execute action on remove modal
    // $scope.$on('modal.removed', function() {
    //     // Execute action
    // });



});