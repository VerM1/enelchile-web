angular.module('AnalyticsModule').factory('AnalyticsProvider', ['$http', '$cordovaDevice', '$rootScope', 'ENDPOINTS', 'ANALYTICS_CONFIG', function($http, $cordovaDevice, $rootScope, ENDPOINTS, ANALYTICS_CONFIG) {

  function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  var cid = generateUUID();

  return {
    evento: function(categoria, accion) {

      if (force.isAuthenticated()) {
        categoria = 'Con Loggeo - ' + categoria;
      } else {
        categoria = 'Sin Loggeo - ' + categoria;
      }
      var platform;
      try {
        platform = $cordovaDevice.getPlatform();
      } catch (e) {
        platform = 'Web';
      }
      if (!cid) {
        cid = generateUUID();
      }

      var event = {
        method: 'GET',
        url: ENDPOINTS.ENDPOINTS_ANALYTICS,
        params: {
          cid: cid,
          v: 1,
          tid: ANALYTICS_CONFIG.ID_ANALYTICS,
          t: 'event',
          an: ANALYTICS_CONFIG.APP_NAME,
          av: $rootScope.translation.VERSION_APP,
          aid: ANALYTICS_CONFIG.ID_APP,
          cs: platform,
          ec: categoria,
          ea: accion
        }
      };
      $http(event);

    },
    pantalla: function(screen) {
      var platform;
      try {
        platform = $cordovaDevice.getPlatform();
      } catch (e) {
        platform = 'Web';
      }
      if (!cid) {
        cid = generateUUID();
      }

      var screenview = {
        method: 'GET',
        url: endpoints.ENDPOINTS_ANALYTICS,
        params: {
          cid: cid,
          v: 1,
          tid: $rootScope.translation.ID_ANALYTICS,
          t: 'screenview',
          an: $rootScope.translation.APP_NAME,
          av: $rootScope.translation.VERSION_APP,
          aid: $rootScope.translation.ID_APP,
          cs: platform,

          cd: screen,
          ua: $rootScope.analiticaUa
        }
      };
      $http(screenview);
      /*
      var pageview = {};
      if($rootScope.uidEncrypt){
      	pageview = {
      		method: 'GET',
      		url: endpoints.ENDPOINTS_ANALYTICS,
      		params: {
      			cid: cid,
      			v: 1,
      			tid: $rootScope.translation.ID_ANALYTICS,
      			t: 'pageview',
      			an: $rootScope.translation.APP_NAME,
      			av: $rootScope.translation.VERSION_APP,
      			aid: $rootScope.translation.ID_APP,
      			cs: platform,

      			dp: screen,
      			ua : $rootScope.analiticaUa
      		}
      	};
      }
      $http(pageview);
      */
    }

  };
}]);