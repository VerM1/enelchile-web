angular.module('CoreModule').controller('blackoutCtrl', function($scope, $ionicPlatform, UtilsService, $ionicSlideBoxDelegate, DataMapService, $log, LocalStorageProvider, $rootScope, UsageService, EmergencyService, $ionicModal, $state, $ionicLoading, AnalyticsService, $route, PopupService, UTILS_CONFIG, $ionicScrollDelegate) {
  $scope.isIos = false;
  if ($ionicPlatform.is('ios')) {
    $scope.isIos = true;
  }
  $scope.actualIndex = 0;
  $scope.backHref = "home";

  $scope.isLogged = $rootScope.isLogged;
  $scope.activeSlide = 0;

  //MÉTODO ANALYTICS -- 05-07-2017
  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
  };




  $scope.dataBlackout;
  var clientNumber;
  $scope.typesOfProblems1 = {};
  $scope.typesOfProblems2 = {};
  var selectedTypeProblem = 0;
  $scope.selected1tab = false;
  $scope.selected2tab = false;

  function init() {

    $scope.dataBlackout = {};

    var objTypeOfProblems1 = {
      value: UTILS_CONFIG.BLACKOUT_TYPE_PROBLEM_CODE_1,
      label: $rootScope.translation.BLACKOUT_TYPE_PROBLEM_LABEL_1
    };
    var objTypeOfProblems2 = {
      value: UTILS_CONFIG.BLACKOUT_TYPE_PROBLEM_CODE_2,
      label: $rootScope.translation.BLACKOUT_TYPE_PROBLEM_LABEL_2
    };

    // TIPO DE PROBLEMAS - OPCION 1: VALORES DIRECTO DESDE SERVICIO
    // $ionicLoading.show({
    //   template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
    // });
    // EmergencyService.getBlackoutProblemsList().then(function(response) {
    //   $log.debug(response);
    //   $scope.typesOfProblems1 = response.length > 0 && response[0] ? response[0] : objTypeOfProblems1;
    //   $scope.typesOfProblems2 = response.length > 0 && response[1] ? response[1] : objTypeOfProblems2;
    //   selectedTypeProblem = $scope.typesOfProblems1.value;
    //   $ionicLoading.hide();
    // }, function(err) {
    //   $scope.typesOfProblems1 = objTypeOfProblems1;
    //   $scope.typesOfProblems2 = objTypeOfProblems2;
    //   $log.error(err);
    //   $ionicLoading.hide();
    // });

    // TIPO DE PROBLEMAS - OPCION 2: SE APLICA VALORES DIRECTO, A PETICION DE NEGOCIO
    $scope.typesOfProblems1 = objTypeOfProblems1;
    $scope.typesOfProblems2 = objTypeOfProblems2;
    selectedTypeProblem = $scope.typesOfProblems1.value;

    if ($scope.isLogged) {
      $log.debug("está logeado");
      try {
        DataMapService.deleteItem("uniqueAsset");
        $scope.dataBlackout.items = [];
        UtilsService.getAssetList($rootScope.contactId).then(
          function(items) {
            if (items.length > 0) {
              if (LocalStorageProvider.getLocalStorageItem("asset_list_is_new_request") && LocalStorageProvider.getLocalStorageItem("asset_list_is_new_request") === "true") {
                $scope.activeSlide = 0;
              }
              $ionicSlideBoxDelegate.slide($scope.activeSlide);
              $scope.dataBlackout.items = items;
              clientNumber = $scope.dataBlackout.items[0].numeroSuministro;
              $ionicSlideBoxDelegate.update();
            } else {
              $log.error("No data with that contactId");
              AnalyticsService.evento($rootScope.translation.PAGE_BLACKOUT, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.NO_DATA); //Analytics 
              var modalType = 'info';
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
      $log.debug("no está logeado");
      $scope.activeSlide = 0;
      try {
        if (DataMapService.getItem("uniqueAsset", false)) {
          $scope.backHref = DataMapService.getItem("uniqueAsset", false);
          $log.debug("ES UN ELEMENTO UNICO");
          $scope.dataBlackout.items = [];
          var items = DataMapService.getItem("reportBlackoutObject", false);
          $scope.dataBlackout.items.push(items);
          $ionicSlideBoxDelegate.slide($scope.activeSlide);
          clientNumber = items.numeroSuministro;
          $log.debug("items: ", $scope.dataBlackout.items);
          $ionicSlideBoxDelegate.update();
        } else {
          $log.error("Imposible to find Object: uniqueAsset");
          AnalyticsService.evento($rootScope.translation.PAGE_BLACKOUT, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.NOT_POSSIBLE_FIND_OBJECT); //Analytics 
          var modalType = 'info';
          var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
          var modalContent = $rootScope.translation.NOT_POSSIBLE_FIND_OBJECT + ": uniqueAsset";
          PopupService.openModal(modalType, modalTitle, modalContent, $scope);
        }
      } catch (err) {
        $log.debug("Error: ", err);
      }
    }
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
    if ($rootScope.isLogged) {
      $state.go('session.emergencyMenu');
    } else {
      if ($scope.backHref === "preBlackout") {
        $state.go('guest.preBlackout');
      } else {
        $state.go('guest.home');
      }

    }
  };
  var callbackSuccess = function(success) {
    $ionicLoading.hide()
    $log.debug(success);
    var modalType = 'info';
    var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
    var modalContent = success.message;
    PopupService.openModal(modalType, modalTitle, modalContent, $scope);
  };

  var callbackError = function(err) {
    $ionicLoading.hide();
    AnalyticsService.evento($rootScope.translation.PAGE_BLACKOUT, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.BLACKOUT + "-" + err.message + "-" + err.analyticsCode); //Analytics 
    $log.error(err);
    var modalType = 'error';
    if (err.code && err.code.toString() == UTILS_CONFIG.ERROR_INFO_CODE) {
      modalType = 'info';
    }
    var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
    var modalContent = err.message;
    PopupService.openModal(modalType, modalTitle, modalContent, $scope);
  };


  $scope.pagerClick = function(index) {
    $log.debug("se aplica slide button");
    $ionicSlideBoxDelegate.slide(index);
  };


  $scope.slideHasChanged = function(index) {
    if ($scope.actualIndex < index) {
      AnalyticsService.evento($rootScope.translation.PAGE_BLACKOUT + ' - ' + $rootScope.translation.GA_STEP_02, $rootScope.translation.GA_SWIPE_RIGHT);
    } else {
      AnalyticsService.evento($rootScope.translation.PAGE_BLACKOUT + ' - ' + $rootScope.translation.GA_STEP_02, $rootScope.translation.GA_SWIPE_LEFT);
    } //Fin Analytics

    $scope.actualIndex = index;
    resetForm();
    $ionicSlideBoxDelegate.update();
    $route.reload();
  }

  $scope.forms = {};

  $scope.validateForm = function() {
    if ($scope.forms.blackoutForm.$valid) {
      AnalyticsService.evento($rootScope.translation.PAGE_BLACKOUT, $rootScope.translation.GA_PUSH_SEND_FORM);
      $log.debug("formulario OK");
      var formData = LocalStorageProvider.getLocalStorageItem('no_session_form_data');
      if (formData) {
        if (!$scope.isLogged) {
          formData.name = $scope.forms.blackoutForm.name.$viewValue;
          formData.lastname = $scope.forms.blackoutForm.lastnames.$viewValue;
          formData.email = $scope.forms.blackoutForm.email.$viewValue;
          formData.phone = $scope.forms.blackoutForm.phone.$viewValue;
          formData.cellphone = $scope.forms.blackoutForm.cellphone.$viewValue;
        }
      } else {
        if (!$scope.isLogged) {
          formData = {
            name: $scope.forms.blackoutForm.name.$viewValue,
            lastname: $scope.forms.blackoutForm.lastnames.$viewValue,
            email: $scope.forms.blackoutForm.email.$viewValue,
            phone: $scope.forms.blackoutForm.phone.$viewValue,
            cellphone: $scope.forms.blackoutForm.cellphone.$viewValue
          };
        }
      }
      LocalStorageProvider.setLocalStorageItem('no_session_form_data', formData);
      $ionicLoading.show({
        template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
      });
      $log.debug("selectedTypeProblem: ", selectedTypeProblem);
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
      $log.debug("formulario incorrecto");
    }
  }

  function resetForm() {
    $log.debug("reseteando BlackOut");
    if ($scope.forms.blackoutForm) {
      var formData = LocalStorageProvider.getLocalStorageItem('no_session_form_data');
      if (formData) {
        if (!$scope.isLogged) {
          $scope.forms.blackoutForm.name.$setViewValue(formData.name);
          $scope.forms.blackoutForm.lastnames.$setViewValue(formData.lastname);
          $scope.forms.blackoutForm.email.$setViewValue(formData.email);
          $scope.forms.blackoutForm.phone.$setViewValue(formData.phone);
          $scope.forms.blackoutForm.cellphone.$setViewValue(formData.cellphone);
          $scope.forms.blackoutForm.name.$render();
          $scope.forms.blackoutForm.lastnames.$render();
          $scope.forms.blackoutForm.email.$render();
          $scope.forms.blackoutForm.phone.$render();
          $scope.forms.blackoutForm.cellphone.$render();
        } else {
          $log.debug("está autenticado: no se guardará data en LS");
        }
      } else {
        if (!$scope.isLogged) {
          $scope.forms.blackoutForm.name.$setViewValue("");
          $scope.forms.blackoutForm.lastnames.$setViewValue("");
          $scope.forms.blackoutForm.email.$setViewValue("");
          $scope.forms.blackoutForm.phone.$setViewValue("");
          $scope.forms.blackoutForm.cellphone.$setViewValue("");
          $scope.forms.blackoutForm.name.$render();
          $scope.forms.blackoutForm.lastnames.$render();
          $scope.forms.blackoutForm.email.$render();
          $scope.forms.blackoutForm.phone.$render();
          $scope.forms.blackoutForm.cellphone.$render();
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
    $scope.selected1tab = true;
    $scope.selected2tab = false;
  }



  $scope.selectedProblem = function(item) {
    $scope.selected1tab = false;
    $scope.selected2tab = false;
    selectedTypeProblem = item;
    if (item == $scope.typesOfProblems1.value) {
      AnalyticsService.evento($rootScope.translation.PAGE_BLACKOUT + ' - ' + $rootScope.translation.GA_STEP_02, $rootScope.translation.GA_SELECT_TYPE_OF_INCIDENT + ': ' + $scope.typesOfProblems1.label); //Analytics
      $scope.selected1tab = true;
    } else if (item == $scope.typesOfProblems2.value) {
      AnalyticsService.evento($rootScope.translation.PAGE_BLACKOUT + ' - ' + $rootScope.translation.GA_STEP_02, $rootScope.translation.GA_SELECT_TYPE_OF_INCIDENT + ': ' + $scope.typesOfProblems2.label); //Analytics
      $scope.selected2tab = true;
    } else {
      AnalyticsService.evento($rootScope.translation.PAGE_BLACKOUT + ' - ' + $rootScope.translation.GA_STEP_02, $rootScope.translation.GA_SELECT_TYPE_OF_INCIDENT + ': ' + $scope.typesOfProblems1.label); //Analytics
      $scope.selected1tab = true;
    }

  }

  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('session/blackout') > -1 || n.indexOf('guest/blackout') > -1) {
      AnalyticsService.pantalla($rootScope.translation.PAGE_BLACKOUT);
      $ionicScrollDelegate.scrollTop();
      $log.debug("llamando a resetForm BlackOut");
      resetForm();
      init();
    }
  });
});