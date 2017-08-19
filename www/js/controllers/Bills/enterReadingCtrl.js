angular.module('BillsModule').controller('enterReadingCtrl', function($scope, $state, $rootScope, $log, $ionicLoading, $ionicModal, DataMapService, LocalStorageProvider, BillsService, PopupService, UTILS_CONFIG) {
  $scope.forms = {};
  $scope.selectedIndex = -1;
  $scope.assetDetail = {};
  $scope.showFields = {
    reading: true,
    day: true,
    night: true,
    peak: true
  };

  $scope.validateForm = function() {
    if ($scope.forms.enterReadingForm.$valid) {
      $log.debug("formulario OK");
      $scope.enterReading();
    } else {
      $log.debug("formulario incorrecto");
    }
  };

  $scope.enterReading = function() {
    var params = {};
    params.reading = $scope.forms.enterReadingForm.reading.$modelValue;
    params.day = $scope.forms.enterReadingForm.readingDay.$modelValue;
    params.night = $scope.forms.enterReadingForm.readingNight.$modelValue;
    params.peak = $scope.forms.enterReadingForm.readingPeak.$modelValue;
    $ionicLoading.show({
      template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
    });
    BillsService.setEnterReading($scope.assetDetail.numeroSuministro, params.reading, params.day, params.night, params.peak).then(function(success) {
      $ionicLoading.hide();
      if (success.data) {
        // var textReturn = 'El codigo de su lectura es el ' + success.data.caseId;
        // $scope.openModal('info', 'Ingreso Lectura', textReturn);
        $log.info("success: ", success);
        var modalType = 'info';
        var modalTitle = $rootScope.translation.SUCCESS_MODAL_TITLE;
        var modalContent = 'El codigo de su lectura es el ' + success.data.caseNumber;
        PopupService.openModal(modalType, modalTitle, modalContent, $scope);


      } else {
        $log.error('no data');
      }
    }, function(err) {
      $ionicLoading.hide();
      var modalType = 'error';
      var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
      var modalContent = err.message;
      PopupService.openModal(modalType, modalTitle, modalContent, $scope);
    });
  };


  //DECLARACION DEL OBJETO DE CERRADO DE MODALES
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  function resetForm() {
    $log.debug("reseteando Enter Reading");
    $scope.forms.enterReadingForm.reading.$viewValue = '';
    $scope.forms.enterReadingForm.readingDay.$viewValue = '';
    $scope.forms.enterReadingForm.readingNight.$viewValue = '';
    $scope.forms.enterReadingForm.readingPeak.$viewValue = '';
    $scope.forms.enterReadingForm.$setPristine();
  }

  function setForm() {
    if ($scope.assetDetail.tarifa === UTILS_CONFIG.USAGE_TYPE_RATE_1) {
      $scope.showFields.day = false;
      $scope.showFields.night = false;
      $scope.showFields.peak = false;
      $scope.showFields.reading = true;

    } else if ($scope.assetDetail.tarifa === UTILS_CONFIG.USAGE_TYPE_RATE_2) {
      $scope.showFields.reading = false;
      $scope.showFields.day = true;
      $scope.showFields.night = true;
      $scope.showFields.peak = true;
    } else {
      $scope.showFields.reading = false;
      $scope.showFields.day = true;
      $scope.showFields.night = true;
      $scope.showFields.peak = true;
    }
  }

  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('session/enterReading') > -1) {
      $log.debug("llamando a resetForm Enter Reading");
      $scope.selectedIndex = DataMapService.getItem('currentUsageIndex', true);
      $scope.assetDetail = LocalStorageProvider.getLocalStorageItem('asset_detail_' + $scope.selectedIndex);
      $log.debug($scope.selectedIndex);
      $log.debug($scope.assetDetail.tarifa);
      setForm();
      resetForm();
    }
  });


});