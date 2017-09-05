angular.module('CoreModule').controller('branchesDescriptionCtrl', function($scope, $state, $window, UtilsService, DataMapService, $log, ENDPOINTS, UTILS_CONFIG) {

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
          $log.info("new image: ", $scope.branchesDescription.imagen);
        } else if ($scope.branchesDescription.imagen === null || $scope.branchesDescription.imagen === "") {
          var width = $window.innerWidth;
          var urlMap = ENDPOINTS.ENDPOINTS_GOOGLE_STATICS_MAP + '?center=' + $scope.branchesDescription.latitud + ',' + $scope.branchesDescription.longitud + '&zoom=18&size=' + width + 'x300&maptype=' + UTILS_CONFIG.GOOGLE_MAPS_TYPE_MAP + '&format=png&visual_refresh=true&markers=' + $scope.branchesDescription.latitud + ',' + $scope.branchesDescription.longitud + '&key=' + UTILS_CONFIG.GOOGLE_MAPS_KEY;
          $scope.branchesDescription.imagen = '<img alt="img" src="' + urlMap + '"/>';
        }
        if ($scope.branchesDescription.horario_pago.match("<")) {
          $scope.branchesDescription.horario_pago = replaceAll($scope.branchesDescription.horario_pago, "\\", "\"\"");
          $scope.branchesDescription.horario_pago = replaceAll($scope.branchesDescription.horario_pago, "amp;", "\"\"");
          $scope.branchesDescription.horario_pago = replaceAll($scope.branchesDescription.horario_pago, "href=\"/", "href=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.branchesDescription.horario_pago = replaceAll($scope.branchesDescription.horario_pago, "src=\"/", "src=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.showHtmlPaymentHour = true;
          $log.info("new horario_pago: ", $scope.branchesDescription.horario_pago);
        }
        if ($scope.branchesDescription.horario_especial.match("<")) {
          $scope.branchesDescription.horario_especial = replaceAll($scope.branchesDescription.horario_especial, "\\", "\"\"");
          $scope.branchesDescription.horario_especial = replaceAll($scope.branchesDescription.horario_especial, "amp;", "\"\"");
          $scope.branchesDescription.horario_especial = replaceAll($scope.branchesDescription.horario_especial, "href=\"/", "href=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.branchesDescription.horario_especial = replaceAll($scope.branchesDescription.horario_especial, "src=\"/", "src=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.showHtmlSpecialHour = true;
          $log.info("new horario_especial: ", $scope.branchesDescription.horario_especial);
        }
        if ($scope.branchesDescription.horario_apertura.match("<")) {
          $scope.branchesDescription.horario_apertura = replaceAll($scope.branchesDescription.horario_apertura, "\\", "\"\"");
          $scope.branchesDescription.horario_apertura = replaceAll($scope.branchesDescription.horario_apertura, "amp;", "\"\"");
          $scope.branchesDescription.horario_apertura = replaceAll($scope.branchesDescription.horario_apertura, "href=\"/", "href=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.branchesDescription.horario_apertura = replaceAll($scope.branchesDescription.horario_apertura, "src=\"/", "src=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.showHtmlOpeningHour = true;
          $log.info("new horario_apertura: ", $scope.branchesDescription.horario_apertura);
        }
        if ($scope.branchesDescription.detalle.match("<")) {
          $scope.branchesDescription.detalle = replaceAll($scope.branchesDescription.detalle, "\\", "\"\"");
          $scope.branchesDescription.detalle = replaceAll($scope.branchesDescription.detalle, "amp;", "\"\"");
          $scope.branchesDescription.detalle = replaceAll($scope.branchesDescription.detalle, "href=\"/", "href=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.branchesDescription.detalle = replaceAll($scope.branchesDescription.detalle, "src=\"/", "src=\"" + ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + "/");
          $scope.showHtmlDetail = true;
          $log.info("new detalle: ", $scope.branchesDescription.detalle);
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



  $scope.goBack = function() {
    if (DataMapService.getItem('branches_detail', false)) {
      $log.info("se eliminará el objketo detalle");
      DataMapService.deleteItem('branches_detail');
    }
    $window.history.back();
  }

  $scope.openNavigator = function(latitud, longitud, titulo) {
    var geoString = '';

    if (ionic.Platform.isIOS()) {
      geoString = 'maps://?q=' + latitud + ',' + longitud + '';
    } else if (ionic.Platform.isAndroid()) {
      geoString = 'geo:0,0?q=' + latitud + ',' + longitud + '(' + titulo + ')';
    }
    window.open(geoString, '_system');
  }


  //LOCATIONCHANGESUCCESS
  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('session/branchesDescription') > -1 || n.indexOf('guest/branchesDescription') > -1) {
      init();
    }
  });

});