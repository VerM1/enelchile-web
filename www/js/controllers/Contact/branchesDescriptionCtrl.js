angular.module('CoreModule').controller('branchesDescriptionCtrl', function($scope, $state, $window, UtilsService, DataMapService, $log) {

  $scope.branchesDescription = DataMapService.getItem('branches_detail', false);
  $log.debug("aux: ", $scope.branchesDescription);

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

});