// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('appenel').run(function($rootScope, $log, $ionicPlatform, $state, $window, SALESFORCE_CONFIG, translation_es, LocalStorageProvider, ContactService, $location, $route, UTILS_CONFIG, ENDPOINTS) {

  $rootScope.translation = translation_es;
  $rootScope.isLogged = false;
  $log.debug("$rootScope.isLogged: " + $rootScope.isLogged);
  $rootScope.isMovilDevice = false;
  $rootScope.showRotateIcon = true;

  SALESFORCE_CONFIG.loginURL = ENDPOINTS.ENDPOINTS_SALESFORCE;
  SALESFORCE_CONFIG.proxyURL = ENDPOINTS.ENDPOINTS_SALESFORCE;

  if (LocalStorageProvider.getLocalStorageItem("SALESFORCE_CONFIG", false)) {
    force.init(LocalStorageProvider.getLocalStorageItem("SALESFORCE_CONFIG", false));
  } else {
    force.init(SALESFORCE_CONFIG);
  }

  $ionicPlatform.ready(function() {
    try {
      TestFairy.begin(UTILS_CONFIG.TESTFAIRY_SECRET_KEY);
      $log.debug('TestFairy initialized. API Key::', UTILS_CONFIG.TESTFAIRY_SECRET_KEY);
    } catch (e) {
      $log.debug("TestFairy is not defined for this Platform")
    }

    // for form inputs)
    if ($window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(false);
    }
    if ($window.StatusBar) {
      StatusBar.styleDefault();
    }

    //Load geolocation point from here
    navigator.geolocation.getCurrentPosition(function(pos) {
      $log.debug('position adquired');
    });

    //CARGA DE SUCURSALES.
    if (!LocalStorageProvider.getLocalStorageItem('branches')) {
      ContactService.getBranchesItems().then(function(response) {
        $log.debug("markers: ", response);
      });
    }

    if (LocalStorageProvider.getLocalStorageItem('show_rotate_icon')) {
      $rootScope.showRotateIcon = false;
    }


    //REDIRECCIONAMIENTO A LA PAGINA HOME o CONSUMOS SEGUN SESIóN
    $log.debug("autenticated: ", force.isAuthenticated());
    if (LocalStorageProvider.getLocalStorageItem('pass_tuto')) {
      if (force.isAuthenticated()) {
        $rootScope.isLogged = true;
        $state.go("session.usage");
      } else {
        $rootScope.isLogged = false;
        $state.go("guest.home");
      }
    } else {
      $state.go("tutorial");
    }
  });


  $ionicPlatform.on("pause", function(event) {
    $log.debug("Pause Fired");
    var exception = [];
    exception.push("branches");
    exception.push("no_session_client_number");
    exception.push("pass_tuto");
    exception.push("show_rotate_icon");
    if (force.isAuthenticated()) {
      $rootScope.isLogged = true;
      // exception.push("access_token");
      exception.push("SALESFORCE_CONFIG");
      exception.push("USER_DATA");
      // exception.push("login_data");
      LocalStorageProvider.removeLocalStorageItemExcept(exception);
      LocalStorageProvider.setLocalStorageItem('pass_tuto', "true");
    } else {
      LocalStorageProvider.removeLocalStorageItemExcept(exception);
    }
  });

  $ionicPlatform.on("resume", function(event) {
    $log.debug("Resume Fired");
    if (force.isAuthenticated()) {
      $rootScope.isLogged = true;
      SALESFORCE_CONFIG.loginURL = ENDPOINTS.ENDPOINTS_SALESFORCE;
      SALESFORCE_CONFIG.proxyURL = ENDPOINTS.ENDPOINTS_SALESFORCE;
      if (LocalStorageProvider.getLocalStorageItem("USER_DATA", false)) {
        var userData = LocalStorageProvider.getLocalStorageItem("USER_DATA", false);
        SALESFORCE_CONFIG.accessToken = userData.sessionId;
        LocalStorageProvider.setLocalStorageItem("SALESFORCE_CONFIG", SALESFORCE_CONFIG);
      }
      force.init(SALESFORCE_CONFIG);
    }
  });

})