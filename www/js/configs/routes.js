angular.module('appenel').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  // Ionic uses AngularUI Router which uses the concept of states

  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  /*if (window.localStorage.getItem('isTutorial') == undefined) {
    $urlRouterProvider.otherwise('/tutorial');
  } else if (window.localStorage.getItem('isLogged') == false) {
    $urlRouterProvider.otherwise('/inicio');
  } else {
    //Esto va a cambiar
    $urlRouterProvider.otherwise(window.localStorage.getItem('lastPage'));
  }*/

  $stateProvider

    .state('tutorial', {
      url: '/tutorial',
      templateUrl: 'views/Core/tutorial.html',
      controller: 'tutorialCtrl'
    })

    /*   Sin Sesión   */
    .state('guest', {
      url: '/guest',
      templateUrl: 'views/Core/Footers/guestFooter.html',
      abstract: true,
      controller: 'footerCtrl'
    })

    .state('guest.home', {
      url: '/home',
      views: {
        'tab-home': {
          templateUrl: 'views/Access/home.html',
          controller: 'homeCtrl'
        }
      }
    })

    .state('guest.login', {
      url: '/login',
      cache: false,
      views: {
        'tab-home': {
          templateUrl: 'views/Access/login.html',
          controller: 'loginCtrl'
        }
      }
    })


    .state('guest.register', {
      url: '/register',
      views: {
        'tab-home': {
          templateUrl: 'views/Access/register.html',
          controller: 'registerCtrl'
        }
      }
    })

    .state('guest.validation', {
      url: '/validation',
      views: {
        'tab-home': {
          templateUrl: 'views/Access/validation.html',
          controller: 'validationCtrl'
        }
      }
    })

    .state('guest.verificationStepOne', {
      url: '/verificationStepOne',
      views: {
        'tab-home': {
          templateUrl: 'views/Access/verificationStepOne.html',
          controller: 'verificationStepOneCtrl'
        }
      }
    })

    .state('guest.verificationStepTwo', {
      url: '/verificationStepTwo',
      views: {
        'tab-home': {
          templateUrl: 'views/Access/verificationStepTwo.html',
          controller: 'verificationStepTwoCtrl'
        }
      }
    })

    .state('guest.payBill', {
      url: '/payBill',
      views: {
        'tab-home': {
          templateUrl: 'views/Bills/payBill.html',
          controller: 'payBillCtrl'
        }
      }
    })


    .state('guest.emergencyMenu', {
      url: '/emergencyMenu',
      views: {
        'tab-emergency': {
          templateUrl: 'views/Emergency/emergencyMenu.html',
          controller: 'emergencyMenuCtrl'
        }
      }
    })

    .state('guest.lightingProblems', {
      url: '/lightingProblems',
      views: {
        'tab-emergency': {
          templateUrl: 'views/Emergency/lightingProblems.html',
          controller: 'lightingProblemsCtrl'
        }
      }
    })

    .state('guest.blackout', {
      url: '/blackout',
      views: {
        'tab-emergency': {
          templateUrl: 'views/Emergency/blackout.html',
          controller: 'blackoutCtrl'
        }
      }
    })

    .state('guest.preBlackout', {
      url: '/preBlackout',
      views: {
        'tab-emergency': {
          templateUrl: 'views/Emergency/preBlackout.html',
          controller: 'preBlackoutCtrl'
        }
      }
    })

    .state('guest.accidentRisk', {
      url: '/accidentRisk',
      views: {
        'tab-emergency': {
          templateUrl: 'views/Emergency/accidentRisk.html',
          controller: 'accidentRiskCtrl'
        }
      }
    })

    .state('guest.contactMenu', {
      url: '/contactMenu',
      views: {
        'tab-contact': {
          templateUrl: 'views/Contact/contactMenu.html',
          controller: 'contactMenuCtrl'
        }
      }
    })

    .state('guest.contactForm', {
      url: '/contactForm',
      views: {
        'tab-contact': {
          templateUrl: 'views/Contact/contactForm.html',
          controller: 'contactFormCtrl'
        }
      }
    })


    .state('guest.branchesMap', {
      url: '/branchesMap',
      views: {
        'tab-contact': {
          templateUrl: 'views/Contact/branchesMap.html',
          controller: 'branchesMapCtrl'
        }
      }
    })


    .state('guest.branchesList', {
      url: '/branchesList',
      views: {
        'tab-contact': {
          templateUrl: 'views/Contact/branchesList.html',
          controller: 'branchesListCtrl'
        }
      }
    })

    .state('guest.branchesDescription', {
      url: '/branchesDescription',
      views: {
        'tab-contact': {
          templateUrl: 'views/Contact/branchesDescription.html',
          controller: 'branchesDescriptionCtrl'
        }
      }
    })

    .state('guest.paymentOptions', {
      url: '/paymentOptions',
      views: {
        'tab-contact': {
          templateUrl: 'views/Contact/paymentOptions.html',
          controller: 'paymentOptionsCtrl'
        }
      }
    })

    .state('guest.featuredList', {
      url: '/featuredList',
      views: {
        'tab-featured': {
          templateUrl: 'views/Featured/featuredList.html',
          controller: 'featuredListCtrl'
        }
      }
    })

    .state('guest.featuredDescription', {
      url: '/featuredDescription',
      views: {
        'tab-featured': {
          templateUrl: 'views/Featured/featuredDescription.html',
          controller: 'featuredDescriptionCtrl'
        }
      }
    })

    /*   Fin Sin Sesión   */

    /*   Con Sesión - Footer Principal  */

    .state('session', {
      url: '/session',
      abstract: true,
      templateUrl: 'views/Core/Footers/sessionFooter.html',
      controller: 'footerCtrl'
    })

    .state('session.usage', {
      url: '/usage',
      views: {
        'tab-usage': {
          templateUrl: 'views/Usage/mainContainer.html',
          controller: 'usageCtrl'
        }
      }
    })

    .state('session.enterReading', {
      url: '/enterReading',
      views: {
        'tab-usage': {
          templateUrl: 'views/Bills/enterReading.html',
          controller: 'enterReadingCtrl'
        }
      }
    })

    .state('session.payBill', {
      url: '/payBill',
      views: {
        'tab-usage': {
          templateUrl: 'views/Bills/payBill.html',
          controller: 'payBillCtrl'
        }
      }
    })

    .state('session.sendElectronicDoc', {
      url: '/sendElectronicDoc',
      views: {
        'tab-usage': {
          templateUrl: 'views/ManageAssets/sendElectronicDoc.html',
          controller: 'sendElectronicDocCtrl'
        }
      }
    })

    .state('session.emergencyMenu', {
      url: '/emergencyMenu',
      views: {
        'tab-emergency': {
          templateUrl: 'views/Emergency/emergencyMenu.html',
          controller: 'emergencyMenuCtrl'
        }
      }
    })

    .state('session.lightingProblems', {
      url: '/lightingProblems',
      views: {
        'tab-emergency': {
          templateUrl: 'views/Emergency/lightingProblems.html',
          controller: 'lightingProblemsCtrl'
        }
      }
    })

    .state('session.blackout', {
      url: '/blackout',
      views: {
        'tab-emergency': {
          templateUrl: 'views/Emergency/blackout.html',
          controller: 'blackoutCtrl'
        }
      }
    })

    .state('session.accidentRisk', {
      url: '/accidentRisk',
      views: {
        'tab-emergency': {
          templateUrl: 'views/Emergency/accidentRisk.html',
          controller: 'accidentRiskCtrl'
        }
      }
    })

    .state('session.contactMenu', {
      url: '/contactMenu',
      views: {
        'tab-contact': {
          templateUrl: 'views/Contact/contactMenu.html',
          controller: 'contactMenuCtrl'
        }
      }
    })

    .state('session.contactForm', {
      url: '/contactForm',
      views: {
        'tab-contact': {
          templateUrl: 'views/Contact/contactForm.html',
          controller: 'contactFormCtrl'
        }
      }
    })


    .state('session.branchesMap', {
      url: '/branchesMap',
      views: {
        'tab-contact': {
          templateUrl: 'views/Contact/branchesMap.html',
          controller: 'branchesMapCtrl'
        }
      }
    })


    .state('session.branchesList', {
      url: '/branchesList',
      views: {
        'tab-contact': {
          templateUrl: 'views/Contact/branchesList.html',
          controller: 'branchesListCtrl'
        }
      }
    })

    .state('session.branchesDescription', {
      url: '/branchesDescription',
      views: {
        'tab-contact': {
          templateUrl: 'views/Contact/branchesDescription.html',
          controller: 'branchesDescriptionCtrl'
        }
      }
    })
    .state('session.paymentOptions', {
      url: '/paymentOptions',
      views: {
        'tab-contact': {
          templateUrl: 'views/Contact/paymentOptions.html',
          controller: 'paymentOptionsCtrl'
        }
      }
    })

    .state('session.notification', {
      url: '/notification',
      views: {
        'tab-notification': {
          templateUrl: 'views/Notification/notificationList.html',
          controller: 'notificationCtrl'
        }
      }
    })


    .state('session.featuredList', {
      url: '/featuredList',
      views: {
        'tab-featured': {
          templateUrl: 'views/Featured/featuredList.html',
          controller: 'featuredListCtrl'
        }
      }
    })

    .state('session.featuredDescription', {
      url: '/featuredDescription',
      views: {
        'tab-featured': {
          templateUrl: 'views/Featured/featuredDescription.html',
          controller: 'featuredDescriptionCtrl'
        }
      }
    })


    .state('session.profile', {
      url: '/profile',
      views: {
        'profile': {
          templateUrl: 'views/Core/profile.html',
          controller: 'profileCtrl'
        }
      }
    })
  /*   Con Sesión - Footer Principal  */
}])