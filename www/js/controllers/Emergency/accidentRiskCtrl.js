angular.module('CoreModule').controller('accidentRiskCtrl', function($scope, $rootScope, $log, LocalStorageProvider, EmergencyService, $ionicModal, $state, $ionicLoading, UtilsService, $cordovaGeolocation, ContactService, AnalyticsService, PopupService, UTILS_CONFIG) {
  var scope = $scope;
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

  var getAddress = function(calle) {
    var myA = calle.split(/(\d+)/);
    if (myA[0]) {
      return myA[0].trim();
    } else {
      return "";
    }
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
    // $scope.openModal('info', 'Exito', 'Su caso ha sido ingresado con el numero ' + success.caseNumber)
    var modalType = 'success';
    var modalTitle = $rootScope.translation.SUCCESS_MODAL_TITLE;
    var modalContent = $rootScope.translation.SUCCESS_CASE_ENTERED_WITH_NUMBER + ': ' + success.caseNumber;
    PopupService.openModal(modalType, modalTitle, modalContent, $scope);
  };

  var callbackError = function(err) {
    $ionicLoading.hide();
    $log.error(err);
    // $scope.openModal('error', 'Error', 'Su caso no ha podido ser ingresado.  ' + err.message);
    var modalType = 'error';
    if (err.code && err.code.toString() == UTILS_CONFIG.ERROR_INFO_CODE) {
      modalType = 'info';
    }
    var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
    var modalContent = $rootScope.translation.ERROR_CASE_ENTERED_WITH_NUMBER + ': ' + err.message;
    PopupService.openModal(modalType, modalTitle, modalContent, $scope);
  };

  $scope.forms = {};

  $scope.validateForm = function() {
    if ($scope.forms.accidentForm.$valid) {
      $log.debug("formulario OK");
      var formData = LocalStorageProvider.getLocalStorageItem('no_session_form_data');

      if (formData) {
        formData.street = $scope.forms.accidentForm.street.$viewValue;
        formData.number = $scope.forms.accidentForm.number.$viewValue;
        formData.department = $scope.forms.accidentForm.departament.$viewValue;
        formData.state = $scope.forms.accidentForm.state.$viewValue;
        if (!$scope.authenticated) {
          formData.name = $scope.forms.accidentForm.name.$viewValue;
          formData.lastname = $scope.forms.accidentForm.lastname.$viewValue;
          formData.email = $scope.forms.accidentForm.email.$viewValue;
          formData.phone = $scope.forms.accidentForm.phone.$viewValue;
          formData.cellphone = $scope.forms.accidentForm.cellphone.$viewValue;
        }

      } else {
        if (!$scope.authenticated) {
          formData = {
            street: $scope.forms.accidentForm.street.$viewValue,
            number: $scope.forms.accidentForm.number.$viewValue,
            department: $scope.forms.accidentForm.departament.$viewValue,
            // state: $scope.selectedState,
            state: $scope.forms.accidentForm.state.$viewValue,
            name: $scope.forms.accidentForm.name.$viewValue,
            lastname: $scope.forms.accidentForm.lastname.$viewValue,
            email: $scope.forms.accidentForm.email.$viewValue,
            phone: $scope.forms.accidentForm.phone.$viewValue,
            cellphone: $scope.forms.accidentForm.cellphone.$viewValue
          };
        } else {
          formData = {
            street: $scope.forms.accidentForm.street.$viewValue,
            number: $scope.forms.accidentForm.number.$viewValue,
            department: $scope.forms.accidentForm.departament.$viewValue,
            // state: $scope.selectedState.codigoComuna
            state: $scope.forms.accidentForm.state.$viewValue,
          };
        }

      }


      LocalStorageProvider.setLocalStorageItem('no_session_form_data', formData);

      $ionicLoading.show({
        template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
      });
      if (force.isAuthenticated()) {
        //numeroSuministro,siniestro,tipoDeProblema 

        EmergencyService.emergencyRiskAccidentAuth(
          $scope.forms.accidentForm.typeOfProblem.$modelValue.value,
          $scope.forms.accidentForm.street.$viewValue,
          $scope.forms.accidentForm.number.$viewValue,
          $scope.forms.accidentForm.departament.$viewValue,
          $scope.forms.accidentForm.state.$viewValue.codigoComuna,
          $scope.forms.accidentForm.description.$modelValue
        ).then(callbackSuccess, callbackError);
      } else {
        EmergencyService.emergencyRiskAccident(
          $scope.forms.accidentForm.typeOfProblem.$modelValue.value,
          $scope.forms.accidentForm.street.$modelValue,
          $scope.forms.accidentForm.number.$modelValue,
          $scope.forms.accidentForm.departament.$modelValue,
          $scope.forms.accidentForm.state.$viewValue.codigoComuna,
          $scope.forms.accidentForm.name.$viewValue,
          $scope.forms.accidentForm.lastname.$viewValue,
          $scope.forms.accidentForm.email.$viewValue,
          $scope.forms.accidentForm.phone.$viewValue,
          $scope.forms.accidentForm.cellphone.$viewValue,
          $scope.forms.accidentForm.description.$modelValue
        ).then(callbackSuccess, callbackError);
      }
    } else {
      $log.debug("formulario incorrecto");
    }
  }

  function resetForm() {
    $log.debug("reseteando Accident Risk");
    // $scope.forms.accidentForm.typeOfProblem.$setViewValue(01);
    if (address) {
      if (address.calle) {
        var calle = getAddress(address.calle);
        if (calle) {
          $scope.forms.accidentForm.street.$setViewValue(calle);
        } else {
          $scope.forms.accidentForm.street.$setViewValue('');
        }
        var numero = getNumber(address.calle);
        if (numero) {
          $scope.forms.accidentForm.number.$setViewValue(numero);
        } else {
          $scope.forms.accidentForm.number.$setViewValue('');
        }
      } else {
        $scope.forms.accidentForm.street.$setViewValue('');
      }
      if (address.comuna && address.comuna != null && address.comuna != "") {
        $scope.selectedState = getSelectedObject(address.comuna.trim());
        // $scope.forms.accidentForm.state.$modelValue = getSelectedObject(address.comuna.trim());
      } else {
        $scope.selectedState = {}
      }
    } else {
      $scope.forms.accidentForm.number.$setViewValue('');
      $scope.forms.accidentForm.street.$setViewValue('');
    }
    $scope.forms.accidentForm.departament.$setViewValue('');

    if (!force.isAuthenticated()) {
      $scope.forms.accidentForm.departament.$setViewValue('');
      $scope.forms.accidentForm.name.$setViewValue('');
      $scope.forms.accidentForm.lastname.$setViewValue('');
      $scope.forms.accidentForm.email.$setViewValue('');
      $scope.forms.accidentForm.phone.$setViewValue('');
      $scope.forms.accidentForm.cellphone.$setViewValue('');
      $scope.forms.accidentForm.description.$setViewValue('');
    }


    var formData = LocalStorageProvider.getLocalStorageItem('no_session_form_data');
    if (!force.isAuthenticated() && formData) {
      $scope.forms.accidentForm.street.$setViewValue(formData.street);
      $scope.forms.accidentForm.number.$setViewValue(formData.number);
      $scope.forms.accidentForm.departament.$setViewValue(formData.department);
      $scope.forms.accidentForm.name.$setViewValue(formData.name);
      $scope.forms.accidentForm.lastname.$setViewValue(formData.lastname);
      $scope.forms.accidentForm.email.$setViewValue(formData.email);
      $scope.forms.accidentForm.phone.$setViewValue(formData.phone);
      $scope.forms.accidentForm.cellphone.$setViewValue(formData.cellphone);
    }
    $scope.forms.accidentForm.typeOfProblem.$render();
    $scope.forms.accidentForm.street.$render();
    $scope.forms.accidentForm.number.$render();
    $scope.forms.accidentForm.departament.$render();
    $scope.forms.accidentForm.state.$render();
    if (!force.isAuthenticated()) {
      $scope.forms.accidentForm.name.$render();
      $scope.forms.accidentForm.lastname.$render();
      $scope.forms.accidentForm.email.$render();
      $scope.forms.accidentForm.phone.$render();
      $scope.forms.accidentForm.cellphone.$render();
      $scope.forms.accidentForm.description.$render();
    }
    $scope.forms.accidentForm.$setPristine();
  }

  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('guest/accidentRisk') > -1 || n.indexOf('session/accidentRisk') > -1) {
      $scope.authenticated = force.isAuthenticated();
      $ionicLoading.show({
        template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
      });
      EmergencyService.getRiskAccidentProblemsList().then(function(success) {
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