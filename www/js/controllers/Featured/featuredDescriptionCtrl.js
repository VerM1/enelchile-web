angular.module('FeaturedModule').controller('featuredDescriptionCtrl', function($scope, $window, DataMapService, $log) {

  $scope.featuredDescription = DataMapService.getItem('featured_detail', false);

  $scope.openUrl = function(url) {
    window.open(url, '_system');
  };

  $scope.goFeatured = function() {
    if (DataMapService.getItem('featured_detail', false)) {
      DataMapService.deleteItem('featured_detail');
    }
    $window.history.back();
  }

});