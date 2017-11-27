angular.module('CoreModule').controller('tutorialCtrl', function($scope, $rootScope, $ionicPlatform, $log, AnalyticsService, $state, LocalStorageProvider, $ionicSlideBoxDelegate) {
  $scope.isIos = false;
  if ($ionicPlatform.is('ios')) {
    $scope.isIos = true;
  }
  $scope.antIndex = 0;
  AnalyticsService.pantalla($rootScope.translation.GA_TUTORIAL_SLIDE + " " + ($scope.antIndex + 1));


  $scope.passTuto = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion);
    LocalStorageProvider.setLocalStorageItem('pass_tuto', "true");
    if (force.isAuthenticated()) {
      $rootScope.isLogged = true;
      $state.go("session.usage");
    } else {
      $rootScope.isLogged = false;
      $state.go("guest.home");
    }
  }



  //SLIDER EVENT
  $scope.pagerClick = function(index) {
    $ionicSlideBoxDelegate.slide(index);
  };

  $scope.slideHasChanged = function(index) {
    if ($scope.antIndex < index) {
      AnalyticsService.evento($rootScope.translation.GA_TUTORIAL_SLIDE + " " + ($scope.antIndex + 1), $rootScope.translation.GA_SWIPE_RIGHT);
    } else {
      AnalyticsService.evento($rootScope.translation.GA_TUTORIAL_SLIDE + " " + ($scope.antIndex + 1), $rootScope.translation.GA_SWIPE_LEFT);
    }
    $scope.antIndex = index;
    AnalyticsService.pantalla($rootScope.translation.GA_TUTORIAL_SLIDE + " " + ($scope.antIndex + 1));
    $ionicSlideBoxDelegate.slide(index);
  };

});