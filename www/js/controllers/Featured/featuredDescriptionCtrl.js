angular.module('FeaturedModule').controller('featuredDescriptionCtrl', function($scope, $window, DataMapService, $log, ENDPOINTS) {

  function init() {
    $scope.featuredDescription = {};
    $scope.showHtmlImage = false;
    $scope.showHtmlDetail = false;
    try {
      if (DataMapService.getItem('featured_detail', false)) {
        $scope.featuredDescription = DataMapService.getItem('featured_detail', false);
        $log.debug("featuredDescription: ", $scope.featuredDescription);
        if ($scope.featuredDescription.imagen.match("<")) {
          $scope.featuredDescription.imagen = replaceAll($scope.featuredDescription.imagen, "\\", "\"\"");
          $scope.featuredDescription.imagen = replaceAll($scope.featuredDescription.imagen, "amp;", "");
          $scope.featuredDescription.imagen = replaceAll($scope.featuredDescription.imagen, "href=\"/", "href=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.featuredDescription.imagen = replaceAll($scope.featuredDescription.imagen, "src=\"/", "src=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.showHtmlImage = true;
          $log.info("new image: ", $scope.featuredDescription.imagen);
        }
        if ($scope.featuredDescription.detalle.match("<")) {
          $scope.featuredDescription.detalle = replaceAll($scope.featuredDescription.detalle, "\\", "\"\"");
          $scope.featuredDescription.detalle = replaceAll($scope.featuredDescription.detalle, "amp;", "\"\"");
          $scope.featuredDescription.detalle = replaceAll($scope.featuredDescription.detalle, "href=\"/", "href=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.featuredDescription.detalle = replaceAll($scope.featuredDescription.detalle, "src=\"/", "src=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.showHtmlDetail = true;
          $log.info("new detalle: ", $scope.featuredDescription.detalle);
        }
      } else {
        $log.error("Error to get branches_detail");
      }

    } catch (exception) {
      $log.error("Error to get branches_detail: ", exception);
    }

  }

  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  }

  function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }


  $scope.openUrl = function(url) {
    window.open(url, '_system');
  };

  $scope.goFeatured = function() {
    if (DataMapService.getItem('featured_detail', false)) {
      DataMapService.deleteItem('featured_detail');
    }
    $window.history.back();
  }

  //LOCATIONCHANGESUCCESS
  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('session/featuredDescription') > -1 || n.indexOf('guest/featuredDescription') > -1) {
      init();
    }
  });

});