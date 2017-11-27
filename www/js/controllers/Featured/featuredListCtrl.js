angular.module('FeaturedModule').controller('featuredListCtrl', function($scope, $rootScope, $state, FeaturedService, DataMapService, $log, $ionicModal, $ionicLoading, AnalyticsService, PopupService, UTILS_CONFIG, $ionicScrollDelegate) {

  $scope.featuredList = [];

  var ctrlInit = function() {
    $ionicLoading.show({
      template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
    });
    FeaturedService.getFeaturedItems().then(function(response) {
      $scope.featuredList = response;
      $ionicLoading.hide();
    }, function(err) {
      $log.error("Error: ", err);
      $ionicLoading.hide();
      AnalyticsService.evento($rootScope.translation.PAGE_FEATURED, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.GET_FEATURED_LIST + "-" + err.message + "-" + err.analyticsCode); //Analytics 
      var modalType = 'error';
      if (err.code && err.code.toString() == UTILS_CONFIG.ERROR_INFO_CODE) {
        modalType = 'info';
      }
      var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
      var modalContent = err.message;
      PopupService.openModal(modalType, modalTitle, modalContent, $scope);
    });
  }

  $scope.featuredDescription = function(index) {
    AnalyticsService.evento($rootScope.translation.PAGE_FEATURED, $rootScope.translation.GA_PUSH_FEATURED + ': ' + (index + 1)); //Analytics
    DataMapService.setItem("featured_detail", $scope.featuredList[index]);
    if ($rootScope.isLogged) {
      $state.go('session.featuredDescription');
    } else {
      $state.go('guest.featuredDescription');
    }
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  //MÉTODO ANALYTICS -- 05-07-2017
  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
  };

  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('guest/featuredList') > -1 || n.indexOf('session/featuredList') > -1) {
      AnalyticsService.pantalla($rootScope.translation.PAGE_FEATURED);
      $ionicScrollDelegate.scrollTop();
      ctrlInit();
    }
  });

});