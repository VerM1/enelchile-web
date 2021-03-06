angular.module('ContactModule').controller('contactFormCtrl', function($scope, $ionicPlatform, $state, $ionicSlideBoxDelegate, $ionicLoading, $log, $rootScope, LocalStorageProvider, AnalyticsService, UtilsService, PopupService, ContactService, UTILS_CONFIG, $route, $ionicScrollDelegate) {
  $scope.isIos = false;
  if ($ionicPlatform.is('ios')) {
    $scope.isIos = true;
  }
  $scope.isLogged = $rootScope.isLogged;
  $scope.actualIndex = 0;
  $scope.dataContactForm = {};
  $scope.activeSlide = 0;


  $scope.pagerClick = function(index) {
    $log.debug("se aplica slide button");
    $ionicSlideBoxDelegate.slide(index);
  };


  $scope.slideHasChanged = function(index) {
    $log.debug("slide ejecutado");
    //Inicio Analytics
    if ($scope.actualIndex < index) {
      AnalyticsService.evento($rootScope.translation.PAGE_CONTACT_FORM, $rootScope.translation.GA_SWIPE_RIGHT);
    } else {
      AnalyticsService.evento($rootScope.translation.PAGE_CONTACT_FORM, $rootScope.translation.GA_SWIPE_LEFT);
    } //Fin Analytics

    $scope.actualIndex = index;
    resetForm();
    $ionicSlideBoxDelegate.update();
    $route.reload();
  }


  //MÉTODO ANALYTICS
  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
  };

  $scope.forms = {};
  $scope.buttons = {
    chosen: ""
  };


  var init = function() {
    $ionicLoading.show({
      template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
    });
    UtilsService.getSubjectList().then(function(success) {
      $ionicLoading.hide();
      $log.debug();
      $scope.typeList = success;

    }, function(err) {
      $ionicLoading.hide();
      AnalyticsService.evento($rootScope.translation.PAGE_CONTACT_FORM, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.GET_SUBJECT_LIST + "-" + err.message + "-" + err.analyticsCode); //Analytics 
      $log.error(err.message);
    });

    $scope.dataContactForm.items = [];
    if ($scope.isLogged == true) {
      $ionicLoading.show({
        template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
      });
      UtilsService.getAssetList().then(function(items) {
          if (items.length > 0) {
            if (LocalStorageProvider.getLocalStorageItem("asset_list_is_new_request") && LocalStorageProvider.getLocalStorageItem("asset_list_is_new_request") === "true") {
              $scope.activeSlide = 0;
            }
            $ionicSlideBoxDelegate.slide($scope.activeSlide);
            $scope.dataContactForm.items = items;
            $ionicLoading.hide();
            $ionicSlideBoxDelegate.update();
          } else {
            $log.error("No data");
            $ionicLoading.hide();
            AnalyticsService.evento($rootScope.translation.PAGE_CONTACT_FORM, $rootScope.translation.GA_SUCCESS_SERVICES_RESPONSE + "-" + $rootScope.translation.NO_DATA); //Analytics 
            var modalType = 'info';
            var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
            var modalContent = $rootScope.translation.NO_DATA;
            PopupService.openModal(modalType, modalTitle, modalContent, $scope);
          }
        },
        function(err) {
          $log.error('Error to get Asset List: ', err);
          $ionicLoading.hide();
          AnalyticsService.evento($rootScope.translation.PAGE_CONTACT_FORM, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.GET_ASSET_LIST + "-" + err.message + "-" + err.analyticsCode); //Analytics 
          var modalType = 'error';
          if (err.code && err.code.toString() == UTILS_CONFIG.ERROR_INFO_CODE) {
            modalType = 'info';
          }
          var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
          var modalContent = err.message;
          PopupService.openModal(modalType, modalTitle, modalContent, $scope);
        });
    }
  }


  $scope.validateForm = function() {
    if ($scope.forms.contactForm.$valid) {
      AnalyticsService.evento($rootScope.translation.PAGE_CONTACT_FORM, $rootScope.translation.GA_PUSH_SEND_FORM);
      $log.debug("formulario OK");
      var asunto = $scope.forms.contactForm.topic.$viewValue.value;
      var descripcion = $scope.forms.contactForm.message.$viewValue;
      var formData;
      try {
        formData = LocalStorageProvider.getLocalStorageItem('no_session_form_data');
      } catch (exception) {
        $log.error("Error to get no_session_form_data localstorage ");
      }
      if ($scope.isLogged == true) {
        var numeroSuministro = $scope.dataContactForm.items[$scope.actualIndex].numeroSuministro;
        $ionicLoading.show({
          template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
        });
        ContactService.setContactFormAuth(numeroSuministro, asunto, descripcion).then(function(response) {
          $ionicLoading.hide();
          var modalType = 'info';
          var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
          var modalContent = response.message;
          PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
            $state.go("session.contactMenu");
            $scope.modal.hide();
          });

        }, function(err) {
          $ionicLoading.hide();
          AnalyticsService.evento($rootScope.translation.PAGE_CONTACT_FORM, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.SET_CONTACT_FORM + "-" + err.message + "-" + err.analyticsCode); //Analytics 
          var modalType = 'error';
          if (err.code && err.code.toString() == UTILS_CONFIG.ERROR_INFO_CODE) {
            modalType = 'info';
          }
          var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
          var modalContent = $rootScope.translation.ERROR_FIND_GEOCODE + err.message;
          PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
            $scope.modal.hide();
          });
        });
      } else {
        var numeroSuministro = $scope.forms.contactForm.numClient.$viewValue;
        var rut = $scope.forms.contactForm.rut.$viewValue;;
        var nombres = $scope.forms.contactForm.names.$viewValue;
        var apellidoPaterno = $scope.forms.contactForm.lastName.$viewValue;
        var email = $scope.forms.contactForm.email.$viewValue;
        var telefono = $scope.forms.contactForm.phone.$viewValue;
        var movil = $scope.forms.contactForm.cellphone.$viewValue;
        if (formData) {
          formData.rut = $scope.forms.contactForm.rut.$viewValue;
          formData.name = $scope.forms.contactForm.names.$viewValue;
          formData.lastname = $scope.forms.contactForm.lastName.$viewValue;
          formData.email = $scope.forms.contactForm.email.$viewValue;
          formData.phone = $scope.forms.contactForm.phone.$viewValue;
          formData.cellphone = $scope.forms.contactForm.cellphone.$viewValue;

        } else {
          formData = {
            rut: $scope.forms.contactForm.rut.$viewValue,
            name: $scope.forms.contactForm.names.$viewValue,
            lastname: $scope.forms.contactForm.lastName.$viewValue,
            email: $scope.forms.contactForm.email.$viewValue,
            phone: $scope.forms.contactForm.phone.$viewValue,
            cellphone: $scope.forms.contactForm.cellphone.$viewValue
          };
        }
        $ionicLoading.show({
          template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
        });
        ContactService.setContactForm(numeroSuministro, asunto, rut, nombres, apellidoPaterno, email, telefono, movil, descripcion).then(function(response) {
          $ionicLoading.hide();
          LocalStorageProvider.setLocalStorageItem('no_session_form_data', formData);
          var modalType = 'info';
          var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
          var modalContent = response.message;
          PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
            $state.go("guest.contactMenu");
            $scope.modal.hide();
          });

        }, function(err) {
          $ionicLoading.hide();
          AnalyticsService.evento($rootScope.translation.PAGE_CONTACT_FORM, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.SET_CONTACT_FORM + "-" + err.message + "-" + err.analyticsCode); //Analytics 
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
      }
    } else {
      $log.debug("formulario incorrecto");
    }
  }

  function resetForm() {
    if ($scope.forms.contactForm) {
      $log.debug("reseteando Contact Form");

      var formData = LocalStorageProvider.getLocalStorageItem('no_session_form_data');
      if ($scope.isLogged == false) {
        if (formData) {
          $scope.forms.contactForm.rut.$setViewValue(formData.rut);
          $scope.forms.contactForm.names.$setViewValue(formData.name);
          $scope.forms.contactForm.lastName.$setViewValue(formData.lastname);
          $scope.forms.contactForm.email.$setViewValue(formData.email);
          $scope.forms.contactForm.phone.$setViewValue(formData.phone);
          $scope.forms.contactForm.cellphone.$setViewValue(formData.cellphone);
          var clientnum = LocalStorageProvider.getLocalStorageItem('no_session_client_number');
          if (clientnum) {
            $scope.forms.contactForm.numClient.$setViewValue(clientnum);
          }
        } else {
          $scope.forms.contactForm.rut.$viewValue = '';
          $scope.forms.contactForm.names.$viewValue = '';
          $scope.forms.contactForm.lastName.$viewValue = '';
          $scope.forms.contactForm.email.$viewValue = '';
          $scope.forms.contactForm.phone.$viewValue = '';
          $scope.forms.contactForm.cellphone.$viewValue = '';
          var clientnum = LocalStorageProvider.getLocalStorageItem('no_session_client_number');
          if (clientnum) {
            $scope.forms.contactForm.numClient.$setViewValue(clientnum);
          } else {
            $scope.forms.contactForm.numClient.$viewValue = '';
          }
        }
        $scope.forms.contactForm.rut.$render();
        $scope.forms.contactForm.names.$render();
        $scope.forms.contactForm.lastName.$render();
        $scope.forms.contactForm.email.$render();
        $scope.forms.contactForm.phone.$render();
        $scope.forms.contactForm.cellphone.$render();
        $scope.forms.contactForm.numClient.$render();

      }
      $scope.forms.contactForm.topic.$viewValue = '';
      $scope.forms.contactForm.topic.$render();
      $scope.forms.contactForm.message.$viewValue = '';
      $scope.forms.contactForm.message.$render();
      $scope.forms.contactForm.$setPristine();
    }
    $route.reload();

  }

  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('guest/contactForm') > -1 || n.indexOf('session/contactForm') > -1) {
      AnalyticsService.pantalla($rootScope.translation.PAGE_CONTACT_FORM);
      $ionicScrollDelegate.scrollTop();
      $log.debug("llamando a resetForm Contact Form");
      resetForm();
      init();
    }
  });
});