angular.module('CoreModule').controller('lightingProblemsCtrl', function($scope, $log, LocalStorageProvider, $rootScope, UtilsService, EmergencyService, $ionicModal, $state, $ionicLoading, $cordovaGeolocation, ContactService, AnalyticsService, PopupService, UTILS_CONFIG) {

  var address;
  $scope.authenticated;
  $scope.listStates = [];
  $scope.listProblemTypes = [];
  var formatAddress = function(addr) {
    var splitted = addr.split(',');
    var addrformat = {
      // "calle": splitted[0].trim(),
      // "comuna": splitted[1].trim(),
      // "region": splitted[2].trim(),
      // "pais": splitted[3].trim()
      "calle": splitted[0],
      "comuna": splitted[1],
      "region": splitted[2],
      "pais": splitted[3]
    };
    return addrformat;
  };

  //MÉTODO ANALYTICS -- 04-07-2017
  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
  };

  $scope.alertMe = function(frase) {
    alert(frase);
  };

  var getNumber = function(calle) {
    const regex = / (\d+)/;
    var arr = regex.exec(calle);
    if (arr) {
      return arr[0].trim();
    } else {
      return "";
    }


  };

  var getSelectedObject = function(stateName) {
    for (i = 0; i < $scope.listStates.length; i++) {
      if ($scope.listStates[i].nombreComuna.toUpperCase().indexOf(stateName.toUpperCase()) !== -1) {
        return $scope.listStates[i];
      }
    }
    return null;
  };

  // $scope.openModal = function(modalType, modalTitle, modalContent) {
  //     var route = 'views/Modals/' + modalType + 'Modal.html';
  //     $ionicModal.fromTemplateUrl(route, {
  //         scope: $scope,
  //         /*animation: 'slide-in-up',*/
  //         animation: modalType == 'help' ? 'slide-in-up' : 'fade',
  //     }).then(function(modal) {
  //         $scope.modal = modal;
  //         $scope.modal.title = modalTitle;
  //         $scope.modal.content = modalContent;
  //         $scope.modal.show();
  //     });
  // };
  $scope.closeModal = function() {
    $log.debug('sending to emergency');
    $scope.modal.hide();
    if (force.isAuthenticated()) {
      $state.go('session.emergency');
    } else {
      $state.go('guest.emergency');
    }

  };
  var callbackSuccess = function(success) {
    $ionicLoading.hide();
    $log.debug(success);
    // $scope.openModal('info', 'Exito', 'Su caso ha sido ingresado con el numero ' + success.caseNumber);
    var modalType = 'info';
    var modalTitle = $rootScope.translation.SUCCESS_MODAL_TITLE;
    var modalContent = 'Su caso ha sido ingresado con el numero: ' + success.caseNumber;
    PopupService.openModal(modalType, modalTitle, modalContent, $scope);
  };

  var callbackError = function(err) {
    $ionicLoading.hide();
    $log.error(err);
    // $scope.openModal('error', 'Error', 'Su caso no ha podido ser ingresado.  ' + err.message);
    var modalType = 'error';
    var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
    var modalContent = 'Su caso no ha podido ser ingresado:  ' + err.message;
    PopupService.openModal(modalType, modalTitle, modalContent, $scope);
  };

  $scope.forms = {};

  $scope.validateForm = function() {
    if ($scope.forms.lightingForm.$valid) {
      $log.debug("formulario OK");
      var formData = LocalStorageProvider.getLocalStorageItem('no_session_form_data');

      if (formData && formData != null && formData != "null") {
        formData.street = $scope.forms.lightingForm.street.$viewValue;
        formData.number = $scope.forms.lightingForm.number.$viewValue;
        formData.department = $scope.forms.lightingForm.departament.$viewValue;
        formData.state = $scope.forms.lightingForm.state.$viewValue;
        if (!$scope.authenticated) {
          formData.name = $scope.forms.lightingForm.name.$viewValue;
          formData.lastname = $scope.forms.lightingForm.lastname.$viewValue;
          formData.email = $scope.forms.lightingForm.email.$viewValue;
          formData.phone = $scope.forms.lightingForm.phone.$viewValue;
          formData.cellphone = $scope.forms.lightingForm.cellphone.$viewValue;
        }
      } else {
        if (!$scope.authenticated) {
          formData = {
            street: $scope.forms.lightingForm.street.$viewValue,
            number: $scope.forms.lightingForm.number.$viewValue,
            department: $scope.forms.lightingForm.departament.$viewValue,
            // state: $scope.selectedState,
            state: $scope.forms.lightingForm.state.$viewValue,
            name: $scope.forms.lightingForm.name.$viewValue,
            lastname: $scope.forms.lightingForm.lastname.$viewValue,
            email: $scope.forms.lightingForm.email.$viewValue,
            phone: $scope.forms.lightingForm.phone.$viewValue,
            cellphone: $scope.forms.lightingForm.cellphone.$viewValue
          };
        } else {
          formData = {
            street: $scope.forms.lightingForm.street.$viewValue,
            number: $scope.forms.lightingForm.number.$viewValue,
            department: $scope.forms.lightingForm.departament.$viewValue,
            // state: $scope.selectedState.codigoComuna
            state: $scope.forms.lightingForm.state.$viewValue,
          };
        }

      }


      LocalStorageProvider.setLocalStorageItem('no_session_form_data', formData);

      $ionicLoading.show({
        template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
      });
      if (force.isAuthenticated()) {
        EmergencyService.emergencyLightingProblemAuth(
          $scope.forms.lightingForm.typeOfProblem.$modelValue.value,
          $scope.forms.lightingForm.street.$modelValue,
          $scope.forms.lightingForm.number.$modelValue,
          $scope.forms.lightingForm.departament.$modelValue,
          // $scope.selectedState.codigoComuna
          $scope.forms.lightingForm.state.$viewValue.codigoComuna,
          $scope.forms.lightingForm.description.$modelValue
        ).then(callbackSuccess, callbackError);
      } else {
        EmergencyService.emergencyLightingProblem(
          $scope.forms.lightingForm.typeOfProblem.$modelValue.value,
          $scope.forms.lightingForm.street.$modelValue,
          $scope.forms.lightingForm.number.$modelValue,
          $scope.forms.lightingForm.departament.$modelValue,
          // $scope.selectedState.codigoComuna,
          $scope.forms.lightingForm.state.$viewValue.codigoComuna,
          $scope.forms.lightingForm.name.$viewValue,
          $scope.forms.lightingForm.lastname.$viewValue,
          $scope.forms.lightingForm.email.$viewValue,
          $scope.forms.lightingForm.phone.$viewValue,
          $scope.forms.lightingForm.cellphone.$viewValue,
          $scope.forms.lightingForm.description.$modelValue
        ).then(callbackSuccess, callbackError);
      }
    } else {
      $log.debug("formulario incorrecto");
    }
  };

  function resetForm() {
    $log.debug("reseteando");
    // $scope.forms.lightingForm.typeOfProblem.$setViewValue(01);
    if (address) {
      if (address.calle) {
        $scope.forms.lightingForm.street.$setViewValue(address.calle);
        var numero = getNumber(address.calle);
        if (numero) {
          $scope.forms.lightingForm.number.$setViewValue(numero);
        } else {
          $scope.forms.lightingForm.number.$setViewValue('');
        }
      } else {
        $scope.forms.lightingForm.street.$setViewValue('');
      }
      if (address.comuna) {
        // $scope.selectedState = getSelectedObject(address.comuna);
        $scope.forms.lightingForm.state.$modelValue = getSelectedObject(address.comuna);
      } else {
        // $scope.selectedState = {}
      }
    } else {
      $scope.forms.lightingForm.number.$setViewValue('');
      $scope.forms.lightingForm.street.$setViewValue('');
    }


    if (!force.isAuthenticated()) {
      $scope.forms.lightingForm.departament.$setViewValue('');
      $scope.forms.lightingForm.name.$setViewValue('');
      $scope.forms.lightingForm.lastname.$setViewValue('');
      $scope.forms.lightingForm.email.$setViewValue('');
      $scope.forms.lightingForm.phone.$setViewValue('');
      $scope.forms.lightingForm.cellphone.$setViewValue('');
      $scope.forms.lightingForm.description.$setViewValue('');
    }


    var formData = LocalStorageProvider.getLocalStorageItem('no_session_form_data');
    if (!force.isAuthenticated() && formData) {
      $scope.forms.lightingForm.street.$setViewValue(formData.street);
      $scope.forms.lightingForm.number.$setViewValue(formData.number);
      $scope.forms.lightingForm.departament.$setViewValue(formData.department);
      $scope.forms.lightingForm.name.$setViewValue(formData.name);
      $scope.forms.lightingForm.lastname.$setViewValue(formData.lastname);
      $scope.forms.lightingForm.email.$setViewValue(formData.email);
      $scope.forms.lightingForm.phone.$setViewValue(formData.phone);
      $scope.forms.lightingForm.cellphone.$setViewValue(formData.cellphone);
    }
    $scope.forms.lightingForm.typeOfProblem.$render();
    $scope.forms.lightingForm.street.$render();
    $scope.forms.lightingForm.number.$render();
    $scope.forms.lightingForm.departament.$render();
    $scope.forms.lightingForm.state.$render();
    if (!force.isAuthenticated()) {
      $scope.forms.lightingForm.name.$render();
      $scope.forms.lightingForm.lastname.$render();
      $scope.forms.lightingForm.email.$render();
      $scope.forms.lightingForm.phone.$render();
      $scope.forms.lightingForm.cellphone.$render();
      $scope.forms.lightingForm.description.$render();
    }
    $scope.forms.lightingForm.$setPristine();
  }

  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('guest/lightingProblems') > -1 || n.indexOf('session/lightingProblems') > -1) {
      $scope.authenticated = force.isAuthenticated();
      $ionicLoading.show({
        template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
      });
      EmergencyService.getLightingProblemsList().then(function(success) {
        $log.debug(success);
        $scope.listProblemTypes = success;
        $ionicLoading.hide();
      }, function(err) {
        $log.error(err);
        $ionicLoading.hide();
      });

      $ionicLoading.show({
        template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
      });
      UtilsService.getStates().then(function(success) {
        $scope.listStates = success;
        $log.debug("llamando a resetForm Accident Risk");
        var options = {
          "timeout": 5000,
          "maximumAge": 30000,
          "enableHighAccuracy": true
        };

        $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
          var lat = position.coords.latitude;
          var long = position.coords.longitude;
          ContactService.geocodeLatLng(lat, long).then(function(success) {
            $log.info(success);
            address = formatAddress(success);
            $ionicLoading.hide();
            resetForm();
          }, function(err) {
            $log.error(err);
            $ionicLoading.hide();
            resetForm();
          })
        }, function(err) {
          $log.error(err);
          $ionicLoading.hide();
          resetForm();
        });
      }, function(err) {
        $ionicLoading.hide();
        resetForm();
      });


    }
  });
});