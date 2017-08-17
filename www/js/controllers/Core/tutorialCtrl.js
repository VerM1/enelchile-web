angular.module('CoreModule').controller('tutorialCtrl', function($scope, $log, AnalyticsService, $state, LocalStorageProvider, $ionicSlideBoxDelegate) {

  $scope.antIndex = 0;

  //MÉTODO ANALYTICS
  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion);
  };

  $scope.passTuto = function(categoria, accion) {
    $scope.sendAnalytics(categoria, accion);
    LocalStorageProvider.setLocalStorageItem('pass_tuto', "true");
    $state.go("guest.home");
  }



  // $scope.options = {
  //   loop: false,
  //   effect: 'slide',
  //   speed: 500,
  //   onInit: function(swiper) {
  //     $scope.swiper = swiper;
  //   },
  //   onSlideChangeEnd: function(swiper) {
  //     //Inicio Analytics
  //     if ($scope.antIndex < swiper.activeIndex) {
  //       AnalyticsService.evento('Splash ' + ($scope.antIndex + 1), 'Swipe Right');
  //     } else {
  //       AnalyticsService.evento('Splash ' + ($scope.antIndex + 1), 'Swipe Left');
  //     } //Fin Analytics
  //     $scope.antIndex = swiper.activeIndex;
  //   }
  // }

  // $scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
  //   $scope.slider = data.slider;
  // });

  // $scope.$on("$ionicSlides.slideChangeStart", function(event, data) {
  //   $log.debug('Slide change is beginning');
  // });

  // $scope.$on("$ionicSlides.slideChangeEnd", function(event, data) {
  //   $scope.activeIndex = data.slider.activeIndex;
  //   $scope.previousIndex = data.slider.previousIndex;
  // });



  //SLIDER EVENT
  $scope.pagerClick = function(index) {
    $ionicSlideBoxDelegate.slide(index);
  };

  //siempre
  $scope.slideHasChanged = function(index) {
    if ($scope.antIndex < index) {
      AnalyticsService.evento('Splash ' + ($scope.antIndex + 1), 'Swipe Right');
    } else {
      AnalyticsService.evento('Splash ' + ($scope.antIndex + 1), 'Swipe Left');
    } //Fin Analytics
    $scope.antIndex = index;
    $ionicSlideBoxDelegate.slide(index);

  };

});