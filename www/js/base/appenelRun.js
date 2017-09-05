// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('appenel').run(function($rootScope, $log, $ionicPlatform, $state, $window, SALESFORCE_CONFIG, translation_es, LocalStorageProvider, ContactService, $location, $route, UTILS_CONFIG, ENDPOINTS, $cordovaPush) {

    $rootScope.translation = translation_es;
    $rootScope.isLogged = false;
    $log.debug("$rootScope.isLogged: " + $rootScope.isLogged);
    $rootScope.isMovilDevice = false;
    $rootScope.showRotateIcon = true;



    // !!!!!++**++ ADMINISTRACION DE TODO EL LOCALSTORAGE ++**++!!!!
    //Remover todos los elementos de LS con excepciones cuando carga por primera vez el app o simplemente cuando carga el App
    var actualDate = "";
    try {
        actualDate = moment().format("MM/DD/YYYY");
    } catch (exception) {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        today = mm + '/' + dd + '/' + yyyy;
        actualDate = today;
    }

    // se validara las sucursales
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_branches")) {
        var dateAux1 = new Date(actualDate).getTime();
        var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_branches")).getTime();
        var thirtyDaysInMilliseconds = 2592000000;
        if (dateAux1 - dateAux2 > thirtyDaysInMilliseconds) {
            LocalStorageProvider.removeLocalStorageItem("branches");
        }
    }

    //se validará los destacados.
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_featured")) {
        var dateAux1 = new Date(actualDate).getTime();
        var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_featured")).getTime();
        if (dateAux1 != dateAux2) {
            LocalStorageProvider.removeLocalStorageItem("featured_list");
        }
    }

    // se validara los tipos de corte de luz
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_blackout_problems")) {
        var dateAux1 = new Date(actualDate).getTime();
        var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_blackout_problems")).getTime();
        var thirtyDaysInMilliseconds = 2592000000;
        if (dateAux1 - dateAux2 > thirtyDaysInMilliseconds) {
            LocalStorageProvider.removeLocalStorageItem("blackout_list");
        }
    }

    // se validara los tipos de alumbrado publico
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_lighting_problems")) {
        var dateAux1 = new Date(actualDate).getTime();
        var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_lighting_problems")).getTime();
        var thirtyDaysInMilliseconds = 2592000000;
        if (dateAux1 - dateAux2 > thirtyDaysInMilliseconds) {
            LocalStorageProvider.removeLocalStorageItem("lighting_list");
        }
    }

    // se validara los tipos de riesgo y accidentes
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_accident_risk_problems")) {
        var dateAux1 = new Date(actualDate).getTime();
        var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_accident_risk_problems")).getTime();
        var thirtyDaysInMilliseconds = 2592000000;
        if (dateAux1 - dateAux2 > thirtyDaysInMilliseconds) {
            LocalStorageProvider.removeLocalStorageItem("risk_accident_list");
        }
    }

    // se validara los tipos de contacto
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_subject_list")) {
        var dateAux1 = new Date(actualDate).getTime();
        var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_subject_list")).getTime();
        var thirtyDaysInMilliseconds = 2592000000;
        if (dateAux1 - dateAux2 >= thirtyDaysInMilliseconds) {
            LocalStorageProvider.removeLocalStorageItem("subject_list");
        }
    }

    // se validara las comunas
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_states")) {
        var dateAux1 = new Date(actualDate).getTime();
        var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_states")).getTime();
        var thirtyDaysInMilliseconds = 2592000000;
        if (dateAux1 - dateAux2 >= thirtyDaysInMilliseconds) {
            LocalStorageProvider.removeLocalStorageItem("states");
        }
    }

    //Mostrar icono de rotacion
    if (LocalStorageProvider.getLocalStorageItem('show_rotate_icon')) {
        $rootScope.showRotateIcon = false;
    }

    //se validara los datos de usuario autenticado en sf
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_user_data")) {
        var dateAux1 = new Date(actualDate).getTime();
        var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_user_data")).getTime();
        if (dateAux1 != dateAux2) {
            LocalStorageProvider.removeLocalStorageIfStartWith("asset_");
        }
    }
    // FIN ADMINISTRACION DE TODO EL LOCALSTORAGE

    // Configuracion de SalesForce
    SALESFORCE_CONFIG.loginURL = ENDPOINTS.ENDPOINTS_SALESFORCE;
    SALESFORCE_CONFIG.proxyURL = ENDPOINTS.ENDPOINTS_SALESFORCE;

    if (LocalStorageProvider.getLocalStorageItem("SALESFORCE_CONFIG")) {
        force.init(LocalStorageProvider.getLocalStorageItem("SALESFORCE_CONFIG"));
    } else {
        force.init(SALESFORCE_CONFIG);
    }


    $ionicPlatform.ready(function() {
        //SI EL DISPOSITIVO TIENE INTERNET
        // if ($window.Connection) {
        // if (navigator.connection.type.toUpperCase() == Connection.NONE.toUpperCase()) {
        //     $ionicPopup.confirm({
        //             title: "Internet Disconnected",
        //             content: "The internet is disconnected on your device."
        //         })
        //         .then(function(result) {
        //             if (!result) {
        //                 ionic.Platform.exitApp();
        //             }
        //         });
        // }
        //}

        if ($window.cordova) {
            cordova.getAppVersion.getVersionNumber().then(function(version) {
                if (version !== LocalStorageProvider.getLocalStorageItem("app_version")) {
                    LocalStorageProvider.clearLocalStorage();
                    LocalStorageProvider.setLocalStorageItem("app_version", version);
                }
            });
        }
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

        if (!LocalStorageProvider.getLocalStorageItem('branches')) {
            ContactService.getBranchesItems().then(function(response) {});
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
        if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_branches")) {
            var dateAux1 = new Date(actualDate).getTime();
            var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_branches")).getTime();
            var thirtyDaysInMilliseconds = 2592000000;
            if (dateAux1 - dateAux2 > thirtyDaysInMilliseconds) {
                LocalStorageProvider.removeLocalStorageItem("branches");
            }
        }

        //se validará los destacados.
        if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_featured")) {
            var dateAux1 = new Date(actualDate).getTime();
            var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_featured")).getTime();
            if (dateAux1 != dateAux2) {
                LocalStorageProvider.removeLocalStorageItem("featured_list");
            }
        }

        // se validara los tipos de corte de luz
        if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_blackout_problems")) {
            var dateAux1 = new Date(actualDate).getTime();
            var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_blackout_problems")).getTime();
            var thirtyDaysInMilliseconds = 2592000000;
            if (dateAux1 - dateAux2 > thirtyDaysInMilliseconds) {
                LocalStorageProvider.removeLocalStorageItem("blackout_list");
            }
        }

        // se validara los tipos de alumbrado publico
        if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_lighting_problems")) {
            var dateAux1 = new Date(actualDate).getTime();
            var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_lighting_problems")).getTime();
            var thirtyDaysInMilliseconds = 2592000000;
            if (dateAux1 - dateAux2 > thirtyDaysInMilliseconds) {
                LocalStorageProvider.removeLocalStorageItem("lighting_list");
            }
        }

        // se validara los tipos de riesgo y accidentes
        if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_accident_risk_problems")) {
            var dateAux1 = new Date(actualDate).getTime();
            var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_accident_risk_problems")).getTime();
            var thirtyDaysInMilliseconds = 2592000000;
            if (dateAux1 - dateAux2 > thirtyDaysInMilliseconds) {
                LocalStorageProvider.removeLocalStorageItem("risk_accident_list");
            }
        }

        // se validara los tipos de contacto
        if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_subject_list")) {
            var dateAux1 = new Date(actualDate).getTime();
            var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_subject_list")).getTime();
            var thirtyDaysInMilliseconds = 2592000000;
            if (dateAux1 - dateAux2 >= thirtyDaysInMilliseconds) {
                LocalStorageProvider.removeLocalStorageItem("subject_list");
            }
        }

        // se validara las comunas
        if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_states")) {
            var dateAux1 = new Date(actualDate).getTime();
            var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_states")).getTime();
            var thirtyDaysInMilliseconds = 2592000000;
            if (dateAux1 - dateAux2 >= thirtyDaysInMilliseconds) {
                LocalStorageProvider.removeLocalStorageItem("states");
            }
        }

        //Mostrar icono de rotacion
        if (LocalStorageProvider.getLocalStorageItem('show_rotate_icon')) {
            $rootScope.showRotateIcon = false;
        }


        //se validara los datos de usuario autenticado en sf
        if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_user_data")) {
            var dateAux1 = new Date(actualDate).getTime();
            var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_user_data")).getTime();
            if (dateAux1 != dateAux2) {
                LocalStorageProvider.removeLocalStorageIfStartWith("asset_");
            }
        }

        if (force.isAuthenticated()) {
            $rootScope.isLogged = true;
        }
    });

    $ionicPlatform.on("resume", function(event) {
        $log.info("Resume Fired");
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



    //PUSH NOTIFICATIONS
    try {
        var push = PushNotification.init({
            android: {
                senderID: "840516435761",
                icon: "notification_push"
            },
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            },
            ios: {
                senderID: "840516435761",
                alert: "true",
                badge: "true",
                sound: "true"
            }
        });

        push.on('registration', function(data) {
            console.log("registrationId: " + data.registrationId);
        });

        push.on('notification', function(data) {
            console.log("se recibio una notificación: " + data);
            //alert(data.message) 
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
        });

        push.on('error', function(e) {
            console.log(e.message)
        });
    } catch (e) {
        console.log("Error al set PushID.");
    }

})