angular.module('UsageModule').controller('sendElectronicDocCtrl', function($scope, $state, $rootScope, $log, $ionicLoading, PopupService, $q, AnalyticsService, UtilsService, LocalStorageProvider, UTILS_CONFIG, DataMapService, $ionicScrollDelegate) {

  //NAVIGATION TABS
  $scope.forms = {};

  //MÉTODO ANALYTICS
  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
  };

  var init = function() {
    //CAMBIAR POR LO QUE CORRESPONDA
    UtilsService.getSubjectList().then(function(success) {
      $ionicLoading.hide();
      $log.debug();
      $scope.listRelationshipWithOwner = success;

    }, function(err) {
      $ionicLoading.hide();
      AnalyticsService.evento($rootScope.translation.PAGE_CONTACT_FORM, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.GET_SUBJECT_LIST + "-" + err.message + "-" + err.analyticsCode); //Analytics 
      $log.error(err.message);
    });

    $scope.isLogged = $rootScope.isLogged;
    $scope.numeroSuministro = "";
    $scope.numeroSuministroDv = "";
    $scope.direccion = "";
    $scope.comuna = "";

    try {
      var assetObject = DataMapService.getItem("sendElectronicDoc");
      $log.debug("sendElectronicDoc: ", assetObject);
      if (assetObject) {
        $scope.numeroSuministro = assetObject.numeroSuministro;
        $scope.numeroSuministroDv = assetObject.numeroSuministroDv;
        $scope.direccion = assetObject.direccion;
        if (assetObject.comuna) {
          $scope.comuna = assetObject.comuna;
        }
        $scope.index = assetObject.index;
      }
    } catch (err) {
      $log.debug("Error: ", err);
    }

  }

  $scope.sendElectronicDocConditions = function() {
    AnalyticsService.evento($rootScope.translation.PAGE_SEND_ELECTRONIC_DOCUMENT, $rootScope.translation.GA_PUSH_OPEN_CONDITIONS);
    var modalType = 'edeConditions';
    var modalTitle = $rootScope.translation.HELPER_MODAL_TITLE;
    var modalContent = "";
    PopupService.openModal(modalType, modalTitle, modalContent, $scope);
  }

  //DECLARACION DEL OBJETO DE CERRADO DE MODALES
  $scope.closeModal = function() {
    $scope.modal.remove()
      .then(function() {
        $scope.modal = null;
      });
  };


  var cleanAll = function() {
    //completar con los datos correspondientes
    $scope.forms.sendElectronicDoc.principalEmail.$viewValue = '';
    $scope.forms.sendElectronicDoc.relationshipWithOwner.$viewValue = '';
    $scope.forms.sendElectronicDoc.secondaryEmail.$viewValue = '';
    $scope.forms.sendElectronicDoc.principalEmail.$render();
    $scope.forms.sendElectronicDoc.relationshipWithOwner.$render();
    $scope.forms.sendElectronicDoc.secondaryEmail.$render();
    $scope.forms.sendElectronicDoc.$setPristine();
  }

  //LOCATIONCHANGESUCCESS
  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('session/sendElectronicDoc') > -1) {
      AnalyticsService.pantalla($rootScope.translation.PAGE_SEND_ELECTRONIC_DOCUMENT);
      $ionicScrollDelegate.scrollTop();
      $log.debug("stateChangeSuccess session/sendElectronicDoc");
      var index = 0;
      cleanAll();
      init();
    }
  });


});