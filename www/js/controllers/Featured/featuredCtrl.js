angular.module('FeaturedModule').controller('featuredCtrl', function($scope, $rootScope, $state, FeaturedService, DataMapService, $log, $ionicModal, $ionicLoading, AnalyticsService, PopupService, UTILS_CONFIG) {

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
      var modalType = 'error';
      var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
      var modalContent = err.message;
      PopupService.openModal(modalType, modalTitle, modalContent, $scope);
    });
  }

  $scope.featuredDescription = function(index) {
    AnalyticsService.evento('Destacados', 'Presionar Destacado ' + (index + 1)); //Analytics
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

  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('guest/featured') > -1 || n.indexOf('session/featured') > -1) {
      ctrlInit();
    }
  });
  //ctrlInit();

});