angular.module('CoreModule').controller('blackoutCtrl', function($scope, UtilsService, $ionicSlideBoxDelegate, DataMapService, $log, LocalStorageProvider, $rootScope, UsageService, EmergencyService, $ionicModal, $state, $ionicLoading, AnalyticsService, $route, PopupService, UTILS_CONFIG) {

  $scope.actualIndex = 0;

  //MÉTODO ANALYTICS -- 05-07-2017
  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
  };

  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('session/blackout') > -1 || n.indexOf('guest/blackout') > -1) {
      $log.debug("llamando a resetForm BlackOut");
      resetForm();
      init();
    }
  });

  $scope.isLogged;
  $scope.dataBlackout;
  var clientNumber;
  $scope.typesOfProblems1 = {};
  $scope.typesOfProblems2 = {};
  var selectedTypeProblem = 0;
  $scope.selected1tab = false;
  $scope.selected2tab = true;

  function init() {
    $scope.isLogged = $rootScope.isLogged;
    $scope.dataBlackout = {};
    $ionicLoading.show({
      template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
    });
    var objTypeOfProblems1 = {
      value: UTILS_CONFIG.BLACKOUT_TYPE_PROBLEM_1,
      label: $rootScope.translation.BLACKOUT_AT_HOME
    };
    var objTypeOfProblems2 = {
      value: UTILS_CONFIG.BLACKOUT_TYPE_PROBLEM_2,
      label: $rootScope.translation.BLACKOUT_AT_NEIGHBORHOOD
    };
    EmergencyService.getBlackoutProblemsList().then(function(response) {
      $log.debug(response);
      $scope.typesOfProblems1 = response.length > 0 && response[0] ? response[0] : objTypeOfProblems1;
      $scope.typesOfProblems2 = response.length > 0 && response[1] ? response[1] : objTypeOfProblems2;
      selectedTypeProblem = $scope.typesOfProblems1.value;
      $ionicLoading.hide();
    }, function(err) {
      $scope.typesOfProblems1 = objTypeOfProblems1;
      $scope.typesOfProblems2 = objTypeOfProblems2;
      $log.error(err);
      $ionicLoading.hide();
    });

    if ($scope.isLogged) {
      $log.info("está logeado");
      try {
        DataMapService.deleteItem("uniqueAsset");
        $scope.dataBlackout.items = [];
        UtilsService.getAssetList($rootScope.contactId).then(
          function(items) {
            if (items.length > 0) {
              $scope.dataBlackout.items = items;
              clientNumber = $scope.dataBlackout.items[0].numeroSuministro;
              $ionicSlideBoxDelegate.update();
            } else {
              $log.error("No data with that contactId");
              var modalType = 'error';
              var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
              var modalContent = $rootScope.translation.NO_DATA;
              PopupService.openModal(modalType, modalTitle, modalContent, $scope);
            }
          },
          callbackError
        );
      } catch (err) {
        $log.error("Error: ", err);
      }
    } else {
      $log.info("no está logeado");
      try {
        if (DataMapService.getItem("uniqueAsset", false)) {
          $log.info("ES UN ELEMENTO UNICO");
          $scope.dataBlackout.items = [];
          var items = DataMapService.getItem("reportBlackoutObject", false);
          $scope.dataBlackout.items.push(items);
          clientNumber = items.numeroSuministro;
          $log.info("items: ", $scope.dataBlackout.items);
          $ionicSlideBoxDelegate.update();
        } else {
          $log.error("Imposible to find Object: uniqueAsset");
          var modalType = 'error';
          var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
          var modalContent = "Imposible to find Object: uniqueAsset";
          PopupService.openModal(modalType, modalTitle, modalContent, $scope);
        }
      } catch (err) {
        $log.info("Error: ", err);
      }
    }
  }

  $scope.closeModal = function() {
    $log.debug('sending to home');
    $scope.modal.hide();
    if ($rootScope.isLogged) {
      $state.go('session.emergency');
    } else {
      $state.go('guest.emergency');
    }
  };
  var callbackSuccess = function(success) {
    $ionicLoading.hide()
    $log.debug(success);
    var modalType = 'validation';
    var modalTitle = $rootScope.translation.SUCCESS_MODAL_TITLE;
    var modalContent = $rootScope.translation.SUCCESS_CASE_ENTERED_WITH_NUMBER + " " + success.caseNumber;
    PopupService.openModal(modalType, modalTitle, modalContent, $scope);
  };

  var callbackError = function(err) {
    $ionicLoading.hide();
    $log.error(err);
    var modalType = 'error';
    var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
    var modalContent = err.message;
    PopupService.openModal(modalType, modalTitle, modalContent, $scope);
  };


  $scope.pagerClick = function(index) {
    $log.info("se aplica slide button");
    $ionicSlideBoxDelegate.slide(index);
  };


  $scope.slideHasChanged = function(index) {
    if ($scope.actualIndex < index) {
      AnalyticsService.evento('Corte de luz', 'Swipe Right Suministros');
    } else {
      AnalyticsService.evento('Corte de luz', 'Swipe Left Suministros');
    } //Fin Analytics

    $scope.actualIndex = index;
    resetForm();
    //$ionicSlideBoxDelegate.slide(index);
    $ionicSlideBoxDelegate.update();
    $route.reload();
  }

  $scope.forms = {};

  $scope.validateForm = function() {
    if ($scope.forms.blackoutForm.$valid) {
      $log.info("formulario OK");
      var formData = LocalStorageProvider.getLocalStorageItem('no_session_form_data');
      if (formData) {
        if (!$scope.isLogged) {
          formData.name = $scope.forms.blackoutForm.name.$viewValue;
          formData.lastname = $scope.forms.blackoutForm.lastnames.$viewValue;
          formData.email = $scope.forms.blackoutForm.email.$viewValue;
          formData.phone = $scope.forms.blackoutForm.phone.$viewValue;
          formData.cellphone = $scope.forms.blackoutForm.cellphone.$viewValue;
          formData.description = $scope.forms.blackoutForm.description.$viewValue;
        }

      } else {
        if (!$scope.isLogged) {
          formData = {
            name: $scope.forms.blackoutForm.name.$viewValue,
            lastnames: $scope.forms.blackoutForm.lastnames.$viewValue,
            email: $scope.forms.blackoutForm.email.$viewValue,
            phone: $scope.forms.blackoutForm.phone.$viewValue,
            cellphone: $scope.forms.blackoutForm.cellphone.$viewValue,
            description: $scope.forms.blackoutForm.description.$viewValue
          };
        }
      }
      LocalStorageProvider.setLocalStorageItem('no_session_form_data', formData);
      $ionicLoading.show({
        template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
      });
      $log.info("selectedTypeProblem: ", selectedTypeProblem);
      if (force.isAuthenticated()) {
        //numeroSuministro,siniestro,tipoDeProblema
        EmergencyService.emergencyLightCutAuth(clientNumber,
          $scope.forms.blackoutForm.description.$modelValue,
          selectedTypeProblem).then(callbackSuccess, callbackError);
      } else {
        EmergencyService.emergencyLightCut(clientNumber,
          $scope.forms.blackoutForm.description.$modelValue,
          selectedTypeProblem,
          $scope.forms.blackoutForm.name.$modelValue,
          $scope.forms.blackoutForm.lastnames.$modelValue,
          $scope.forms.blackoutForm.email.$modelValue,
          $scope.forms.blackoutForm.phone.$modelValue,
          $scope.forms.blackoutForm.cellphone.$modelValue
        ).then(callbackSuccess, callbackError);
      }
    } else {
      $log.info("formulario incorrecto");
    }
  }

  function resetForm() {
    $log.debug("reseteando BlackOut");
    if ($scope.forms.blackoutForm) {
      var formData = LocalStorageProvider.getLocalStorageItem('no_session_form_data');
      if (formData) {
        if (!$scope.isLogged) {
          formData.name = $scope.forms.blackoutForm.name.$viewValue;
          formData.lastname = $scope.forms.blackoutForm.lastnames.$viewValue;
          formData.email = $scope.forms.blackoutForm.email.$viewValue;
          formData.phone = $scope.forms.blackoutForm.phone.$viewValue;
          formData.cellphone = $scope.forms.blackoutForm.cellphone.$viewValue;
        } else {
          $log.debug("está autenticado: no se guardará data en LS");
        }

      } else {
        if (!$scope.isLogged) {
          formData = {
            name: $scope.forms.blackoutForm.name.$viewValue,
            lastnames: $scope.forms.blackoutForm.lastnames.$viewValue,
            email: $scope.forms.blackoutForm.email.$viewValue,
            phone: $scope.forms.blackoutForm.phone.$viewValue,
            cellphone: $scope.forms.blackoutForm.cellphone.$viewValue
          };
        } else {
          $log.debug("está autenticado: no se guardará data en LS");
        }
      }
      $scope.forms.blackoutForm.description.$viewValue = '';
      $scope.forms.blackoutForm.description.$render();
      $scope.forms.blackoutForm.$setPristine();
    } else {
      $log.debug("no existe aun el formulario");
    }
    $scope.selected1tab = false;
    $scope.selected2tab = true;
  }



  $scope.selectedProblem = function(item) {
    $scope.selected1tab = false;
    $scope.selected2tab = false;
    selectedTypeProblem = item;
    if (item == $scope.typesOfProblems1.value) {
      AnalyticsService.evento('Corte de luz - Paso 2', 'Seleccionar:' + $scope.typesOfProblems1.label); //Analytics
      $scope.selected1tab = true;
    } else if (item == $scope.typesOfProblems2.value) {
      AnalyticsService.evento('Corte de luz - Paso 2', 'Seleccionar:' + $scope.typesOfProblems2.label); //Analytics
      $scope.selected2tab = true;
    } else {
      AnalyticsService.evento('Corte de luz - Paso 2', 'Seleccionar:' + $scope.typesOfProblems1.label); //Analytics
      $scope.selected1tab = true;
    }
    // switch (item) {
    //     case (item.toString() == $scope.typesOfProblems1.value.toString()):
    //         AnalyticsService.evento('Corte de luz - Paso 2', 'Seleccionar:' + $scope.typesOfProblems1.label.toString()); //Analytics
    //         $scope.selected1tab = true;
    //         break;
    //     case (item.toString() == $scope.typesOfProblems2.value.toString()):
    //         AnalyticsService.evento('Corte de luz - Paso 2', 'Seleccionar:' + $scope.typesOfProblems2.label.toString()); //Analytics
    //         $scope.selected2tab = true;
    //         break;
    //     default:
    //         AnalyticsService.evento('Corte de luz - Paso 2', 'Seleccionar:' + $scope.typesOfProblems1.label.toString()); //Analytics
    //         $scope.selected1tab = true;
    //         break;
    // }
  }
});