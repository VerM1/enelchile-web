angular.module('CoreModule').controller('oauthcallbackCtrl', function($scope, $log, $rootScope, window) {


  if (window.opener.force && window.opener.force.oauthCallback) {
    window.opener.force.oauthCallback(decodeURIComponent(window.location.href));
    alert("en foce");
  } else if (window.opener.oauthCallback) {
    window.opener.oauthCallback(decodeURIComponent(window.location.href));
    alert("no foce");
  }

  // $scope.saveurl = function() {
  //   $log.info("accedi al callback controller");
  // }
});