angular.module('CoreModule').controller('branchesListCtrl', function($scope, $state, $rootScope, $log, LocalStorageProvider, DataMapService, ContactService, $ionicLoading, PopupService, UTILS_CONFIG, AnalyticsService, $ionicScrollDelegate) {

  function init() {
    $scope.branchesList = {};
    $ionicLoading.show({
      template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
    });
    ContactService.getBranchesItems()
      .then(function(response) {
        $log.debug(response);
        $scope.branchesList = response;
        $ionicLoading.hide();
      }, function(err) {
        $log.error(err);
        AnalyticsService.evento($rootScope.translation.PAGE_BRANCHES_LIST, $rootScope.translation.GA_ERROR_SERVICES_RESPONSE + "-" + $rootScope.translation.GET_BRANCHES + "-" + err.message + "-" + err.analyticsCode); //Analytics 
        var modalType = 'error';
        if (err.code && err.code.toString() == UTILS_CONFIG.ERROR_INFO_CODE) {
          modalType = 'info';
        }
        var modalTitle = $rootScope.translation.ATTENTION_MODAL_TITLE;
        var modalContent = err.message;
        PopupService.openModal(modalType, modalTitle, modalContent, $scope, function() {
          $scope.modal.hide();
        });
        $ionicLoading.hide();
      });
  }


  $scope.goToMap = function() {
    AnalyticsService.evento($rootScope.translation.PAGE_BRANCHES_LIST, $rootScope.translation.GA_PUSH_OPEN_MAP);
    $log.debug("go goToMap");
    $log.debug("$rootScope.isLogged: " + $rootScope.isLogged);
    if ($rootScope.isLogged) {
      $state.go('session.branchesMap');
    } else {
      $state.go('guest.branchesMap');
    }
  }

  $scope.goToList = function() {
    AnalyticsService.evento($rootScope.translation.PAGE_BRANCHES_LIST, $rootScope.translation.GA_PUSH_OPEN_LIST);
    $log.debug("go goToList");
    $log.debug("$rootScope.isLogged: " + $rootScope.isLogged);
    if ($rootScope.isLogged) {
      $state.go('session.branchesList');
    } else {
      $state.go('guest.branchesList');
    }
  }

  $scope.viewDescription = function(index) {
    AnalyticsService.evento($rootScope.translation.PAGE_BRANCHES_LIST, $rootScope.translation.GA_PUSH_VIEW_DESCRIPTION);
    if ($scope.branchesList.branches && $scope.branchesList.branches[index]) {
      DataMapService.setItem("branches_detail", $scope.branchesList.branches[index]);
      if ($rootScope.isLogged) {
        $state.go('session.branchesDescription');
      } else {
        $state.go('guest.branchesDescription');
      }
    } else {
      $log.error("Imposible to find element in list");
    }

  }

  $scope.sendAnalytics = function(categoria, accion) {
    AnalyticsService.evento(categoria, accion);
  }


  $scope.$on('$locationChangeSuccess', function(ev, n) {
    if (n.indexOf('session/branchesList') > -1 || n.indexOf('guest/branchesList') > -1) {
      AnalyticsService.pantalla($rootScope.translation.PAGE_BRANCHES_LIST);
      $ionicScrollDelegate.scrollTop();
      init();
    }
  });
});