angular.module('FeaturedModule').controller('featuredDescriptionCtrl', function($scope, $state, $window, DataMapService, $log, ENDPOINTS, AnalyticsService, $rootScope, $ionicScrollDelegate) {

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
          $log.debug("new image: ", $scope.featuredDescription.imagen);
        }
        if ($scope.featuredDescription.detalle.match("<")) {
          $scope.featuredDescription.detalle = replaceAll($scope.featuredDescription.detalle, "\\", "\"\"");
          $scope.featuredDescription.detalle = replaceAll($scope.featuredDescription.detalle, "amp;", "\"\"");
          $scope.featuredDescription.detalle = replaceAll($scope.featuredDescription.detalle, "href=\"/", "href=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.featuredDescription.detalle = replaceAll($scope.featuredDescription.detalle, "src=\"/", "src=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.showHtmlDetail = true;
          $log.debug("new detalle: ", $scope.featuredDescription.detalle);
        }
      } else {
        $log.error("Error to get branches_detail");
        AnalyticsService.evento($rootScope.translation.PAGE_FEATURED_DESCRIPTION, $rootScope.translation.GA_SUCCESS_SERVICES_RESPONSE + "-" + $rootScope.translation.ERROR_FEATURED_DETAIL); //Analytics 
      }

    } catch (exception) {
      $log.error("Error to get branches_detail: ", exception);
      AnalyticsService.evento($rootScope.translation.PAGE_FEATURED_DESCRIPTION, $rootScope.translation.GA_SUCCESS_SERVICES_RESPONSE + "-" + $rootScope.translation.ERROR_FEATURED_DETAIL); //Analytics 
    }

  }

  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  }

  function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }


  $scope.openUrl = function(url, title) {
    AnalyticsService.evento($rootScope.translation.PAGE_FEATURED_DESCRIPTION, $rootScope.translation.GA_PUSH_OPEN_EXTERNAL_FEATURED + ": " + title);
    window.open(url, '_system');
  };

  $scope.goFeatured = function() {
    AnalyticsService.evento($rootScope.translation.PAGE_FEATURED_DESCRIPTION, $rootScope.translation.GA_PUSH_BACK_BUTTON);
    if (DataMapService.getItem('featured_detail', false)) {
      DataMapService.deleteItem('featured_detail');
    }
    if ($rootScope.isLogged) {
      $state.go('session.featuredList');
    } else {
      $state.go('guest.featuredList');
    }
  }

  //MÉTODO ANALYTICS -- 05-07-2017
  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
  };

  //LOCATIONCHANGESUCCESS
  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('session/featuredDescription') > -1 || n.indexOf('guest/featuredDescription') > -1) {
      AnalyticsService.pantalla($rootScope.translation.PAGE_FEATURED_DESCRIPTION);
      $ionicScrollDelegate.scrollTop();
      init();
    }
  });

});