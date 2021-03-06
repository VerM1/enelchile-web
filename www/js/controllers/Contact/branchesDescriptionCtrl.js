angular.module('CoreModule').controller('branchesDescriptionCtrl', function($scope, $state, $window, UtilsService, DataMapService, $log, ENDPOINTS, UTILS_CONFIG, AnalyticsService, $rootScope, $ionicScrollDelegate) {

  function init() {
    $scope.branchesDescription = {};
    $scope.showHtmlImage = false;
    $scope.showHtmlPaymentHour = false;
    $scope.showHtmlSpecialHour = false;
    $scope.showHtmlOpeningHour = false;
    $scope.showHtmlDetail = false;
    try {
      if (DataMapService.getItem('branches_detail', false)) {
        $scope.branchesDescription = DataMapService.getItem('branches_detail', false);
        $log.debug("branchesDescription: ", $scope.branchesDescription);
        if ($scope.branchesDescription.imagen.match("<")) {
          $scope.branchesDescription.imagen = replaceAll($scope.branchesDescription.imagen, "\\", "\"\"");
          $scope.branchesDescription.imagen = replaceAll($scope.branchesDescription.imagen, "amp;", "");
          $scope.branchesDescription.imagen = replaceAll($scope.branchesDescription.imagen, "href=\"/", "href=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.branchesDescription.imagen = replaceAll($scope.branchesDescription.imagen, "src=\"/", "src=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.showHtmlImage = true;
          $log.debug("new image: ", $scope.branchesDescription.imagen);
        } else if ($scope.branchesDescription.imagen === null || $scope.branchesDescription.imagen === "") {
          $scope.showHtmlImage = false;
          var width = $window.innerWidth;
          var urlMap = ENDPOINTS.ENDPOINTS_GOOGLE_STATICS_MAP + '?center=' + $scope.branchesDescription.latitud + ',' + $scope.branchesDescription.longitud + '&zoom=' + UTILS_CONFIG.GOOGLE_MAPS_GOOGLE_STATIC_ZOOM + '&size=' + width + 'x300&maptype=' + UTILS_CONFIG.GOOGLE_MAPS_TYPE_MAP + '&format=png&visual_refresh=true&markers=' + $scope.branchesDescription.latitud + ',' + $scope.branchesDescription.longitud + '&key=' + UTILS_CONFIG.GOOGLE_MAPS_KEY;
          $scope.branchesDescription.imagen = urlMap;
        }
        if ($scope.branchesDescription.horario_pago.match("<")) {
          $scope.branchesDescription.horario_pago = replaceAll($scope.branchesDescription.horario_pago, "\\", "\"\"");
          $scope.branchesDescription.horario_pago = replaceAll($scope.branchesDescription.horario_pago, "amp;", "\"\"");
          $scope.branchesDescription.horario_pago = replaceAll($scope.branchesDescription.horario_pago, "href=\"/", "href=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.branchesDescription.horario_pago = replaceAll($scope.branchesDescription.horario_pago, "src=\"/", "src=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.showHtmlPaymentHour = true;
          $log.debug("new horario_pago: ", $scope.branchesDescription.horario_pago);
        }
        if ($scope.branchesDescription.horario_especial.match("<")) {
          $scope.branchesDescription.horario_especial = replaceAll($scope.branchesDescription.horario_especial, "\\", "\"\"");
          $scope.branchesDescription.horario_especial = replaceAll($scope.branchesDescription.horario_especial, "amp;", "\"\"");
          $scope.branchesDescription.horario_especial = replaceAll($scope.branchesDescription.horario_especial, "href=\"/", "href=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.branchesDescription.horario_especial = replaceAll($scope.branchesDescription.horario_especial, "src=\"/", "src=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.showHtmlSpecialHour = true;
          $log.debug("new horario_especial: ", $scope.branchesDescription.horario_especial);
        }
        if ($scope.branchesDescription.horario_apertura.match("<")) {
          $scope.branchesDescription.horario_apertura = replaceAll($scope.branchesDescription.horario_apertura, "\\", "\"\"");
          $scope.branchesDescription.horario_apertura = replaceAll($scope.branchesDescription.horario_apertura, "amp;", "\"\"");
          $scope.branchesDescription.horario_apertura = replaceAll($scope.branchesDescription.horario_apertura, "href=\"/", "href=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.branchesDescription.horario_apertura = replaceAll($scope.branchesDescription.horario_apertura, "src=\"/", "src=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.showHtmlOpeningHour = true;
          $log.debug("new horario_apertura: ", $scope.branchesDescription.horario_apertura);
        }
        if ($scope.branchesDescription.detalle.match("<")) {
          $scope.branchesDescription.detalle = replaceAll($scope.branchesDescription.detalle, "\\", "\"\"");
          $scope.branchesDescription.detalle = replaceAll($scope.branchesDescription.detalle, "amp;", "\"\"");
          $scope.branchesDescription.detalle = replaceAll($scope.branchesDescription.detalle, "href=\"/", "href=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.branchesDescription.detalle = replaceAll($scope.branchesDescription.detalle, "src=\"/", "src=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.showHtmlDetail = true;
          $log.debug("new detalle: ", $scope.branchesDescription.detalle);
        }
      } else {
        $log.error("Error to get branches_detail");
        AnalyticsService.evento($rootScope.translation.PAGE_BRANCHES_DETAIL, $rootScope.translation.GA_SUCCESS_SERVICES_RESPONSE + "-" + $rootScope.translation.GET_BRANCHES_DETAIL); //Analytics 
      }

    } catch (exception) {
      $log.error("Error to get branches_detail: ", exception);
      AnalyticsService.evento($rootScope.translation.PAGE_BRANCHES_DETAIL, $rootScope.translation.GA_SUCCESS_SERVICES_RESPONSE + "-" + $rootScope.translation.GET_BRANCHES_DETAIL); //Analytics 
    }

  }


  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  }

  function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }



  $scope.goBack = function() {
    AnalyticsService.evento($rootScope.translation.PAGE_BRANCHES_DESCRIPTION, $rootScope.translation.GA_PUSH_BACK_BUTTON);
    if (DataMapService.getItem('branches_detail', false)) {
      $log.debug("se eliminará el objeto detalle");
      DataMapService.deleteItem('branches_detail');
    }
    $window.history.back();
  }

  $scope.openNavigator = function(latitud, longitud, titulo) {
    AnalyticsService.evento($rootScope.translation.PAGE_BRANCHES_DESCRIPTION, $rootScope.translation.GA_PUSH_OPEN_EXTERNAL_BRANCHES + " - " + titulo);
    var geoString = '';

    if (ionic.Platform.isIOS()) {
      geoString = 'maps://?q=' + latitud + ',' + longitud + '';
    } else if (ionic.Platform.isAndroid()) {
      geoString = 'geo:0,0?q=' + latitud + ',' + longitud + '(' + titulo + ')';
    }
    window.open(geoString, '_system');
  }

  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion);
  }


  //LOCATIONCHANGESUCCESS
  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('session/branchesDescription') > -1 || n.indexOf('guest/branchesDescription') > -1) {
      AnalyticsService.pantalla($rootScope.translation.PAGE_BRANCHES_DESCRIPTION);
      $ionicScrollDelegate.scrollTop();
      init();
    }
  });

});