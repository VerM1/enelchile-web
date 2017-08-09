angular.module('ContactModule').controller('contactFormCtrl', function($scope, $state, $ionicSlideBoxDelegate, $ionicLoading, $log, $rootScope, LocalStorageProvider, AnalyticsService, UtilsService, PopupService, ContactService, UTILS_CONFIG, $route) {

  $scope.isLogged = $rootScope.isLogged;
  $scope.actualIndex = 0;
  $scope.dataContactForm = {};



  // $scope.slide = function(index) {
  //     $ionicSlideBoxDelegate.slide(index);
  // };

  // $scope.slideHasChanged = function(index) {
  //     //Inicio Analytics
  //     if ($scope.actualIndex < index) {
  //         AnalyticsService.evento('Formulario de Contacto', 'Swipe Right Suministros');
  //     } else {
  //         AnalyticsService.evento('Formulario de Contacto', 'Swipe Left Suministros');
  //     } //Fin Analytics

  //     $scope.actualIndex = index;
  //     $log.debug("slide ejecutado");
  //     resetForm();
  // }


  $scope.pagerClick = function(index) {
    $log.info("se aplica slide button");
    $ionicSlideBoxDelegate.slide(index);
  };


  $scope.slideHasChanged = function(index) {
    $log.debug("slide ejecutado");
    //Inicio Analytics
    if ($scope.actualIndex < index) {
      AnalyticsService.evento('Formulario de Contacto', 'Swipe Right Suministros');
    } else {
      AnalyticsService.evento('Formulario de Contacto', 'Swipe Left Suministros');
    } //Fin Analytics

    $scope.actualIndex = index;
    resetForm();
    //$ionicSlideBoxDelegate.slide(index);
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
      $log.error(err.message);
    });

    $scope.dataContactForm.items = [];
    if ($scope.isLogged == true) {
      $ionicLoading.show({
        template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
      });
      UtilsService.getAssetList().then(function(items) {
          if (items.length > 0) {
            $scope.dataContactForm.items = items;
            $ionicLoading.hide();
            $ionicSlideBoxDelegate.update();
          } else {
            $log.error("No data");
            $ionicLoading.hide();
            var modalType = 'error';
            var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
            var modalContent = $rootScope.translation.NO_DATA;
            PopupService.openModal(modalType, modalTitle, modalContent, $scope);
          }
        },
        function(err) {
          $log.error('Error to get Asset List: ', err);
          $ionicLoading.hide();
          var modalType = 'error';
          var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
          var modalContent = err.message;
          PopupService.openModal(modalType, modalTitle, modalContent, $scope);
        });
    }
  }


  $scope.validateForm = function() {
    if ($scope.forms.contactForm.$valid) {
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
          var modalType = 'validation';
          var modalTitle = $rootScope.translation.SUCCESS_MODAL_TITLE;
          var modalContent = 'Su contacto ha sido ingresado con el numero: ' + response.caseNumber;
          PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
            $state.go("session.contact");
            $scope.modal.hide();
          });

        }, function(err) {
          $ionicLoading.hide();
          var modalType = 'error';
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
        var apellidoMaterno = $scope.forms.contactForm.motherLastName.$viewValue;
        var email = $scope.forms.contactForm.email.$viewValue;
        var telefono = $scope.forms.contactForm.phone.$viewValue;
        if (formData) {
          formData.rut = $scope.forms.contactForm.rut.$viewValue;
          formData.name = $scope.forms.contactForm.names.$viewValue;
          formData.lastname = $scope.forms.contactForm.lastName.$viewValue;
          formData.motherLastname = $scope.forms.contactForm.motherLastName.$viewValue;
          formData.email = $scope.forms.contactForm.email.$viewValue;
          formData.phone = $scope.forms.contactForm.phone.$viewValue;

        } else {
          formData = {
            rut: $scope.forms.contactForm.rut.$viewValue,
            name: $scope.forms.contactForm.names.$viewValue,
            lastname: $scope.forms.contactForm.lastName.$viewValue,
            motherLastname: $scope.forms.contactForm.motherLastName.$viewValue,
            email: $scope.forms.contactForm.email.$viewValue,
            phone: $scope.forms.contactForm.phone.$viewValue
          };
        }
        $ionicLoading.show({
          template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
        });
        ContactService.setContactForm(numeroSuministro, asunto, rut, nombres, apellidoPaterno, apellidoMaterno, email, telefono, descripcion).then(function(response) {
          $ionicLoading.hide();
          LocalStorageProvider.setLocalStorageItem('no_session_form_data', formData);
          var modalType = 'validation';
          var modalTitle = $rootScope.translation.SUCCESS_MODAL_TITLE;
          var modalContent = 'Su contacto ha sido ingresado con el numero: ' + response.caseNumber;
          PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
            $state.go("guest.contact");
            $scope.modal.hide();
          });

        }, function(err) {
          $ionicLoading.hide();
          var modalType = 'error';
          var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
          var modalContent = 'Su contacto no ha podido ser ingresado:  ' + err.message;
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
          $scope.forms.contactForm.motherLastName.$setViewValue(formData.motherLastname);
          $scope.forms.contactForm.email.$setViewValue(formData.email);
          $scope.forms.contactForm.phone.$setViewValue(formData.phone);
          var clientnum = LocalStorageProvider.getLocalStorageItem('no_session_client_number');
          if (clientnum) {
            $scope.forms.contactForm.numClient.$setViewValue(clientnum);
          }
        } else {
          $scope.forms.contactForm.rut.$viewValue = '';
          $scope.forms.contactForm.names.$viewValue = '';
          $scope.forms.contactForm.lastName.$viewValue = '';
          $scope.forms.contactForm.motherLastName.$viewValue = '';
          $scope.forms.contactForm.email.$viewValue = '';
          $scope.forms.contactForm.phone.$viewValue = '';
          $scope.forms.contactForm.numClient.$viewValue = '';
        }
        $scope.forms.contactForm.rut.$render();
        $scope.forms.contactForm.names.$render();
        $scope.forms.contactForm.lastName.$render();
        $scope.forms.contactForm.motherLastName.$render();
        $scope.forms.contactForm.email.$render();
        $scope.forms.contactForm.phone.$render();
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
      $log.debug("llamando a resetForm Contact Form");
      resetForm();
      init();
    }
  });
});