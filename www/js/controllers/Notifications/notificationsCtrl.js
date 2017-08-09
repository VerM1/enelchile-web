angular.module('CoreModule').controller('notificationsCtrl', function($scope, $ionicModal, AnalyticsService) {

  $ionicModal.fromTemplateUrl('views/Notifications/notificationsDetails.html', {
    scope: $scope,
    /*animation: 'slide-in-up',*/
    animation: 'fade',
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };

  //MÉTODO ANALYTICS
  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
  };

  $scope.closeModal = function() {
    AnalyticsService.evento('Notificaciones', 'Aceptar lectura notificación');
    $scope.modal.hide();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    //$scope.modal.remove();
  });

  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });

  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });



});