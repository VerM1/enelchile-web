angular.module('CoreModule').controller('branchesMapCtrl', function($scope, $state, $window, $rootScope, UtilsService, $cordovaGeolocation, ContactService, DataMapService, $log, LocalStorageProvider, $route, $ionicLoading, AnalyticsService, PopupService, UTILS_CONFIG) {

  $scope.goToMap = function() {
    AnalyticsService.evento('Sucursales Cercanas', 'Presionar Mapa'); //Analytics
    $rootScope.tabActualAnalytics = 'Sucursales Cercanas';
    $log.debug("go goToMap");
    $log.debug("$rootScope.isLogged: " + $rootScope.isLogged);
    if ($rootScope.isLogged) {
      $state.go('session.branchesMap');
    } else {
      $state.go('guest.branchesMap');
    }
  }

  $scope.goToList = function() {
    AnalyticsService.evento('Sucursales Cercanas', 'Presionar Lista'); //Analytics
    $rootScope.tabActualAnalytics = 'Sucursales Cercanas';
    $log.debug("go goToList");
    $log.debug("$rootScope.isLogged: " + $rootScope.isLogged);
    if ($rootScope.isLogged == true) {
      $state.go('session.branchesList');
    } else {
      $state.go('guest.branchesList');
    }
  }

  $scope.markersJson = {};
  $scope.markersGoogle = {};
  $scope.markersGoogle.branches = [];
  $scope.markersGoogle.paymentPlaces = [];
  var codeBranches = UTILS_CONFIG.CONTACT_CODE_BRANCHES;
  var codePaymentPlaces = UTILS_CONFIG.CONTACT_CODE_PAYMENT_PLACES;

  //MÉTODO ANALYTICS
  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion);
  };

  $scope.selectedItem = function(item) {
    $scope.selectedBar1 = false;
    $scope.selectedBar2 = false;
    $log.debug("$scope.selectedBar1: " + $scope.selectedBar1);
    $log.debug("$scope.selectedBar2: " + $scope.selectedBar2);
    $log.debug("$scope.selectedBar3: " + $scope.selectedBar3);
    switch (item) {
      case 1:
        AnalyticsService.evento('Sucursales Cercanas', 'Presionar Sucursales'); //Analytics
        $rootScope.tabActualAnalytics = 'Sucursales Cercanas';
        $log.debug("Selected Case Number is 1");
        clearMarkers($scope.markersGoogle.branches);
        clearMarkers($scope.markersGoogle.paymentPlaces);
        if ($rootScope.isLogged) {
          $state.go('session.branchesMap');
        } else {
          $state.go('guest.branchesMap');
        }
        if ($scope.markersJson.branches) {
          setMapOnAll($scope.markersJson.branches, codeBranches);
        }
        $route.reload();
        break;
      case 2:
        AnalyticsService.evento('Sucursales Cercanas', 'Presionar Lugares de Pago'); //Analytics
        $rootScope.tabActualAnalytics = 'Sucursales Cercanas';
        $log.debug("Selected Case Number is 2");
        clearMarkers($scope.markersGoogle.branches);
        clearMarkers($scope.markersGoogle.paymentPlaces);
        if ($rootScope.isLogged) {
          $state.go('session.branchesMap');
        } else {
          $state.go('guest.branchesMap');
        }
        if ($scope.markersJson.paymentPlaces) {
          setMapOnAll($scope.markersJson.paymentPlaces, codePaymentPlaces);
        }
        $route.reload();
        break;
      case 3:
        AnalyticsService.evento('Sucursales Cercanas', 'Presionar Otros Medios de Pago'); //Analytics
        $rootScope.tabActualAnalytics = 'Sucursales Cercanas';
        $log.debug("Selected Case Number is 3");
        if ($rootScope.isLogged) {
          $state.go('session.paymentOptions');
        } else {
          $state.go('guest.paymentOptions');
        }
        $route.reload();
        break;
      default:
        $scope.selectedBar1 = true;
        $rootScope.tabActualAnalytics = 'Sucursales Cercanas';
        $log.debug("Selected Case Default");
        clearMarkers($scope.markersGoogle.branches);
        clearMarkers($scope.markersGoogle.paymentPlaces);
        if ($rootScope.isLogged) {
          $state.go('session.branchesMap');
        } else {
          $state.go('guest.branchesMap');
        }
        if ($scope.markersJson.branches) {
          setMapOnAll($scope.markersJson.branches, codeBranches);
        }
        $route.reload();
        break;
    }
  }

  function initMap() {

    //INICIALIZACION DE MAPA
    var mapOptions = {
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //INICIALIZACION DE GEOLOCALIZACION
    var options = {
      timeout: 10000,
      enableHighAccuracy: true
    };
    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      $log.debug("posicion: ", position.coords.latitude, "/", position.coords.longitude);
      $scope.map.setCenter(latLng);
    }, function(error) {
      $log.debug("Could not get location");
    });
    ContactService.getBranchesItems().then(function(response) {
      $scope.markersJson = response;
      // setMapOnAll($scope.markersJson.branches, codeBranches);
      $scope.selectedItem(1);
    }, function(err) {
      var modalType = 'info';
      var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
      var modalContent = $rootScope.translation.ERROR_FIND_GEOCODE + err.message;
      PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
        $scope.modal.hide();
      });
    });
    $rootScope.tabActualAnalytics = 'Sucursales Cercanas';
  }



  //CRECION/EDICION/MODIFICACION/ELIMINACION DEL MARCADOR EN EL MAPA
  // Sets the map on all markers in the array.
  function setMapOnAll(markers, type) {
    $ionicLoading.show({
      template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
    });
    if (markers && $scope.map) {
      for (var i = 0; i < markers.length; i++) {
        var obj = markers[i];
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(obj.latitud, obj.longitud),
          map: $scope.map
        });
        marker.addListener('click', function(obj) {
          return function() {
            DataMapService.setItem("branches_detail", obj);
            if ($rootScope.isLogged) {
              $state.go('session.branchesDescription');
            } else {
              $state.go('guest.branchesDescription');
            }
          };
        }(obj));
        if (type == UTILS_CONFIG.CONTACT_CODE_BRANCHES) {
          $scope.markersGoogle.branches.push(marker);

        } else if (type == UTILS_CONFIG.CONTACT_CODE_PAYMENT_PLACES) {
          $scope.markersGoogle.paymentPlaces.push(marker);
        }
      }
    } else {
      $log.error("imposible to get markers");
    }
    if (type == UTILS_CONFIG.CONTACT_CODE_BRANCHES) {
      $scope.selectedBar1 = true;

    } else if (type == UTILS_CONFIG.CONTACT_CODE_PAYMENT_PLACES) {
      $scope.selectedBar2 = true;
    }
    $ionicLoading.hide();
  }

  // Removes the markers from the map, but keeps them in the array.
  function clearMarkers(markers) {
    $ionicLoading.show({
      template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
    });
    for (var i = 0; i < markers.length; i++) {
      var marker = markers[i];
      marker.setMap(null);
    }
    $ionicLoading.hide();
  }


  $scope.searchElementOnMap = function(address) {
    AnalyticsService.evento('Sucursales Cercanas', 'Presionar Buscar'); //Analytics
    if (address && address.length > 0) {
      $log.debug("address.length: ", address.length);
      $ionicLoading.show({
        template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
      });
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        'address': address
      }, function(results, status) {
        if (status == 'OK') {
          $scope.map.setCenter(results[0].geometry.location);
          $ionicLoading.hide();
        } else {
          $ionicLoading.hide();
          $log.error('Geocode was not successful for the following reason: ' + status);
          var modalType = 'info';
          var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
          var modalContent = $rootScope.translation.ERROR_FIND_GEOCODE + status;
          PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
            $scope.modal.hide();
          });
        }
      });
    } else {
      $log.error('Search button empty');
      var modalType = 'info';
      var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
      var modalContent = $rootScope.translation.MUST_NOT_EMPTY;
      PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
        $scope.modal.hide();
      });
    }
  }



  //LOCATIONCHANGESUCCESS
  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('session/branchesMap') > -1 || n.indexOf('guest/branchesMap') > -1) {
      initMap();
      // $scope.selectedItem(1);
    }
  });
});