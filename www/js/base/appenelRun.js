// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('appenel').run(function($rootScope, $log, $ionicPlatform, $state, $window, SALESFORCE_CONFIG, translation_es, LocalStorageProvider, ContactService, UTILS_CONFIG, ENDPOINTS, $cordovaPush, notifications, NotificationService, UtilsService) {
  $rootScope.translation = translation_es;
  $rootScope.isLogged = false;
  $log.debug("$rootScope.isLogged: " + $rootScope.isLogged);
  $rootScope.isMovilDevice = false;
  $rootScope.showRotateIcon = true;
  $rootScope.xidDevice = "";
  $rootScope.appVersion = "1.0";

  // !!!!!++**++ ADMINISTRACION DE TODO EL LOCALSTORAGE ++**++!!!!
  UtilsService.manageLocalStorageWhenRunApp();

  // Configuracion de SalesForce
  SALESFORCE_CONFIG.loginURL = ENDPOINTS.ENDPOINTS_SALESFORCE;
  SALESFORCE_CONFIG.proxyURL = ENDPOINTS.ENDPOINTS_SALESFORCE;

  if (LocalStorageProvider.getLocalStorageItem("SALESFORCE_CONFIG")) {
    force.init(LocalStorageProvider.getLocalStorageItem("SALESFORCE_CONFIG"));
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

    // for form inputs
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(false);
      if ($ionicPlatform.is('android')) {
        window.addEventListener('native.keyboardshow', keyboardShowHandler);

        function keyboardShowHandler(e) {
          document.body.classList.add('keyboard-open-android');
        }
        window.addEventListener('native.keyboardhide', keyboardHideHandler);

        function keyboardHideHandler(e) {
          document.body.classList.remove('keyboard-open-android');
        }
      }
    }
    if ($window.StatusBar) {
      StatusBar.styleDefault();
    }

    //Load geolocation point from here
    navigator.geolocation.getCurrentPosition(function(pos) {
      $log.debug('position adquired');
    });

    if (!LocalStorageProvider.getLocalStorageItem('branches')) {
      ContactService.getBranchesItems().then(function(response) {});
    }

    if ($window.cordova) {
      cordova.getAppVersion.getVersionNumber().then(function(version) {
        $log.debug("version: ", version);
        $rootScope.appVersion = version;
        UtilsService.manageLocalStorageWhenUpdateApp(version);
      });
    }


    //PUSH NOTIFICATIONS
    try {
      $rootScope.push = PushNotification.init({
        android: {
          senderID: "384369609407", //CHILE
          icon: "notification_push"
        },
        browser: {
          pushServiceURL: 'http://push.api.phonegap.com/v1/push'
        },
        ios: {
          senderID: "384369609407", //CHILE
          gcmSandbox: true,
          alert: "true",
          badge: "true",
          sound: "true"
        }
      });
      $rootScope.push.on('registration', function(data) {
        $log.debug("registrationId: " + data.registrationId);
        $rootScope.xidDevice = data.registrationId;
        if (force.isAuthenticated()) {
          var platformDevice = "";
          if ($ionicPlatform.is("ios")) {
            platformDevice = "ios";
          } else if ($ionicPlatform.is("android")) {
            platformDevice = "android";
          }
          UtilsService.setXID($rootScope.xidDevice, platformDevice);
        }
      });

      $rootScope.push.on('notification', function(data) {
        NotificationService.getNotificationList();
        notifications.closeAll();
        $rootScope.$apply();
        notifications.showSuccess({
          message: '<div class="row padding-top-10" ui-sref="session.notification"><div class="col-20 position-rel">' + UTILS_CONFIG.NOTIFICATION_ICON_IMAGE + '</div><div class="col-80 position-rel"><h4 class="notification-title">' + data.title + '</h4><p class="notification-message">' + data.message + '</p></div></div>',
        });
        $rootScope.$apply();
      });

      $rootScope.push.on('error', function(e) {
        $log.error(e.message)
      });
      //SE INICIA EL CONTADOR DE NOTIFICACIONES EN 0
      UtilsService.setBadgeNumber(0);
    } catch (e) {
      $log.error("Error al set PushID: ", e);
    }

    //REDIRECCIONAMIENTO A LA PAGINA HOME o CONSUMOS SEGUN SESIóN
    $log.debug("autenticated: ", force.isAuthenticated());
    if (LocalStorageProvider.getLocalStorageItem('pass_tuto')) {
      if (force.isAuthenticated()) {
        $rootScope.isLogged = true;
        NotificationService.getNotificationList();
        if (LocalStorageProvider.getLocalStorageItem("push_notification")) {
          LocalStorageProvider.removeLocalStorageItem("push_notification");
          $state.go("session.notification");
        } else {
          $state.go("session.usage");
        }
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
    UtilsService.manageLocalStorageWhenPauseApp();
    if (force.isAuthenticated()) {
      $rootScope.isLogged = true;
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
      if (LocalStorageProvider.getLocalStorageItem("push_notification")) {
        LocalStorageProvider.removeLocalStorageItem("push_notification");
        $state.go("session.notification");
      }
    }
  });

  $ionicPlatform.registerBackButtonAction(function(event) {
    event.preventDefault();
  }, 100);
})