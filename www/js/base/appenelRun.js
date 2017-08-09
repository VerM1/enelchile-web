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

  if (window.cordova) {
    $log.debug("dispositivo movil");
    SALESFORCE_CONFIG.oauthCallbackURL = 'http://localhost/oauthcallback.html';
    isMovilDevice = true;
  } else {
    $log.debug("web");
    SALESFORCE_CONFIG.oauthCallbackURL = 'http://localhost:8100/oauthcallback.html';
    isMovilDevice = false;
  }
  SALESFORCE_CONFIG.loginURL = ENDPOINTS.ENDPOINTS_SALESFORCE;
  SALESFORCE_CONFIG.proxyURL = ENDPOINTS.ENDPOINTS_SALESFORCE;

  if (LocalStorageProvider.getLocalStorageItem("SALESFORCE_CONFIG", false)) {
    force.init(LocalStorageProvider.getLocalStorageItem("SALESFORCE_CONFIG", false));
  } else {
    force.init(SALESFORCE_CONFIG);
  }

  $ionicPlatform.ready(function() {
    try {
      TestFairy.begin("5bd10c0da3a67fda56ea3218175f260b96f49d0b");
      $log.debug('TestFairy initialized. API Key::5bd10c0da3a67fda56ea3218175f260b96f49d0b');
    } catch (e) {
      $log.debug("TestFairy is not defined for this Platform")
    }

    // for form inputs)
    if ($window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(false);
    }
    if ($window.StatusBar) {
      // org.apache.cordova.statusbar required
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


    //REDIRECCIONAMIENTO A LA PAGINA HOME o CONSUMOS SEGUN SESIóN
    $log.debug("autenticated: ", force.isAuthenticated());
    if (LocalStorageProvider.getLocalStorageItem('passTuto')) {
      if (force.isAuthenticated()) {
        $rootScope.isLogged = true;
        $state.go("session.usage");
      } else {
        $rootScope.isLogged = false;
        $state.go("guest.home");
      }
      // $state.go("landing");
    } else {
      // LocalStorageProvider.setLocalStorageItem('passTuto', false);
      $state.go("tutorial");
    }
  });


  $ionicPlatform.on("pause", function(event) {
    $log.debug("Pause Fired");
    var exception = [];
    exception.push("Object_branches");
    exception.push("no_session_client_number");
    exception.push("passTuto");
    if (force.isAuthenticated()) {
      $rootScope.isLogged = true;
      // exception.push("contact_id");
      exception.push("access_token");
      exception.push("Object_SALESFORCE_CONFIG");
      exception.push("Object_user_data");
      exception.push("Object_login_data");
      LocalStorageProvider.removeLocalStorageItemExcept(exception);
      LocalStorageProvider.setLocalStorageItem('passTuto', true);
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
      SALESFORCE_CONFIG.accessToken = LocalStorageProvider.getLocalStorageItem("access_token", false);
      LocalStorageProvider.setLocalStorageItem("SALESFORCE_CONFIG", SALESFORCE_CONFIG);
      force.init(LocalStorageProvider.getLocalStorageItem("SALESFORCE_CONFIG", false));
      //$state.go("session.usage");
    }
    // else {
    //   $rootScope.isLogged = false;
    //   if (LocalStorageProvider.getLocalStorageItem('passTuto')) {
    //     $state.go("guest.home");
    //   } else {
    //     $state.go("tutorial");
    //   }
    // }
    // $state.go("landing");
  });

})