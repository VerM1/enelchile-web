angular.module('NotificationModule').controller('notificationCtrl', function($scope, $rootScope, $log, NotificationService, AnalyticsService, PopupService, UTILS_CONFIG, $ionicLoading, $timeout, $route, $ionicScrollDelegate) {
  $scope.data = {
    showDelete: false
  };

  $scope.translation = $rootScope.translation;

  $scope.UTILS_CONFIG = UTILS_CONFIG;

  function init() {
    $scope.items = [];
    $scope.showMessageWithoutNotification = false;
    $ionicLoading.show({
      template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
    });
    NotificationService.getNotificationList().then(function(response) {
      $ionicLoading.hide();
      if (response.length > 0) {
        $scope.items = response;
        $scope.showMessageWithoutNotification = false;
      } else {
        $scope.showMessageWithoutNotification = true;
      }

    }, function(err) {
      $ionicLoading.hide();
      AnalyticsService.evento($rootScope.translation.PAGE_NOTIFICATION, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.GET_NOTIFICATION_LIST + "-" + err.message + "-" + err.analyticsCode); //Analytics 
      $scope.items = [];
      var modalType = "error";
      var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
      var modalContent = err.message;
      PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
        $scope.modal.remove()
          .then(function() {
            $scope.modal = null;
          });
      });
    });
  }

  $scope.doRefresh = function() {
    $log.info('Refreshing');
    $timeout(function() {
      init();
      $scope.$broadcast('scroll.refreshComplete');
    }, 0);
  }


  $scope.deleteNotification = function(item) {
    AnalyticsService.evento($rootScope.translation.PAGE_NOTIFICATION, $rootScope.translation.GA_PUSH_DELETE_NOTIFICATION);
    $log.info("se eliminara el item con taskId: ", item.taskId);
    $log.info("se procedera a marcar como leido el elemento: ", item.taskId);
    $ionicLoading.show({
      template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
    });
    var action = UTILS_CONFIG.NOTIFICATION_UPDATE_TYPE_02;
    NotificationService.updateNotification(item, action).then(function(response) {
      $ionicLoading.hide();
      $scope.items = response;
      $route.reload();
    }, function(err) {
      $ionicLoading.hide();
      AnalyticsService.evento($rootScope.translation.PAGE_NOTIFICATION, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.DELETE_NOTIFICATION + "-" + err.message + "-" + err.analyticsCode); //Analytics 
      var modalType = 'error';
      if (err.code && err.code.toString() == UTILS_CONFIG.ERROR_INFO_CODE) {
        modalType = 'info';
      }
      var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
      var modalContent = err.message;
      PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
        $scope.modal.remove()
          .then(function() {
            $scope.modal = null;
          });
      });
    });
  };

  $scope.openNotification = function(item) {
    AnalyticsService.evento($rootScope.translation.PAGE_NOTIFICATION, $rootScope.translation.GA_PUSH_OPEN_NOTIFICATION);
    $log.info("el id seleccionado es: ", item.taskId);
    $log.info("se procedera a marcar como leido el elemento: ", item.taskId);
    var action = UTILS_CONFIG.NOTIFICATION_UPDATE_TYPE_01;
    if (item.status != UTILS_CONFIG.NOTIFICATION_STATUS_NOTIFICATION_01) {
      NotificationService.updateNotification(item, action).then(function(response) {
        $scope.items = response;
        $route.reload();
      }, function(err) {
        $log.error("error al marcar como leido el elemento: ", err.message);
        AnalyticsService.evento($rootScope.translation.PAGE_NOTIFICATION, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.MARK_AS_READ_NOTIFICATION + "-" + err.message + "-" + err.analyticsCode); //Analytics 
      });
    }
    var modalType = "info";
    var modalTitle = item.titulo;
    var modalContent = item.mensaje;
    PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
      $scope.modal.remove()
        .then(function() {
          $scope.modal = null;
        });
    });
  };

  $scope.markAsRead = function(item) {
    AnalyticsService.evento($rootScope.translation.PAGE_NOTIFICATION, $rootScope.translation.GA_PUSH_MARK_AS_READ_NOTIFICATION);
    $log.info("se procedera a marcar como leido el elemento: ", item.taskId);
    $ionicLoading.show({
      template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
    });
    var action = UTILS_CONFIG.NOTIFICATION_UPDATE_TYPE_01;
    if (item.status != UTILS_CONFIG.NOTIFICATION_STATUS_NOTIFICATION_01) {
      NotificationService.updateNotification(item, action).then(function(response) {
        $ionicLoading.hide();
        $scope.items = response;
        $route.reload();
      }, function(err) {
        $ionicLoading.hide();
        AnalyticsService.evento($rootScope.translation.PAGE_NOTIFICATION, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.MARK_AS_READ_NOTIFICATION + "-" + err.message + "-" + err.analyticsCode); //Analytics 
        var modalType = 'error';
        if (err.code && err.code.toString() == UTILS_CONFIG.ERROR_INFO_CODE) {
          modalType = 'info';
        }
        var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
        var modalContent = err.message;
        PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
          $scope.modal.remove()
            .then(function() {
              $scope.modal = null;
            });
        });
      });
    } else {
      $ionicLoading.hide();
    }
  }

  //MÉTODO ANALYTICS -- 05-07-2017
  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion); //Llamada a Analytics
  };

  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('session/notification') > -1) {
      AnalyticsService.pantalla($rootScope.translation.PAGE_NOTIFICATION);
      $ionicScrollDelegate.scrollTop();
      init();
    }
  });


});