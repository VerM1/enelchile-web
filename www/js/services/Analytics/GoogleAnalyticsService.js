//Constante dónde podemos indicar GoogleAnalytics
angular.module('AnalyticsModule').value('googleAnalyticsId', 'UA-73813005-1');
/**
 * @ngdoc service
 * @name UtilsModule.service:GoogleAnalytics
 * @description
 * Contiene métodos para:
 * - inicializar analytics (mobile only)
 * - comprobar si la app está sobre móvil o sobre web
 * - track screen name
 * - track event
 *
 *
 * Ejemplo de uso
 *----------------
 *
 * Vista/Screen Name:
 * GoogleAnalytics.trackView('Nombre Vista');
 *
 * Evento:
 * $scope.$on('$stateChangeSuccess', function() {
 *    GoogleAnalytics.trackEvent('category', 'action', 'label');
 * });
 *
 * En caso de screen names, es importante encapsular la llamada dentro del watch para asegurarnos
 * que el hit sea mandado cada vez que visualizamos la página, y no sólo cuando se carga el controlador
 * (esto ilustra casos generales, en casos más específicos de controlador multifunción ya deberá buscarse de otro modo)
 * */
angular.module('AnalyticsModule').factory('GoogleAnalytics', ['$log', function GoogleAnalyticsFactory($log) {

  /**
   * @ngdoc method
   * @name UtilsModule.GoogleAnalytics:_trackView
   * @methodOf UtilsModule.service:GoogleAnalytics
   *
   * @description
   * Funciones internas
   *
   * @param {object} viewName - nombre de la vista.
   *
   */
  function _trackView(viewName) {
    if (typeof window.analytics !== 'undefined') {
      window.analytics.trackView(viewName);
      $log.log('Tracked pageview');
    } else {
      setTimeout(function() {
        _trackView(viewName);
      }, 250);
    }
  }

  /**
   * @ngdoc method
   * @name UtilsModule.GoogleAnalytics:_trackEvent
   * @methodOf UtilsModule.service:GoogleAnalytics
   *
   * @description
   * Funciones internas
   *
   * @param {object} categoryParam - categoria de evento.
   * @param {object} actionParam - accion del evento.
   * @param {object} labelParam - label del evento.
   *
   */
  function _trackEvent(categoryParam, actionParam, labelParam) {
    if (typeof window.analytics !== 'undefined') {
      window.analytics.trackEvent(categoryParam, actionParam, labelParam);
    } else {
      setTimeout(function() {
        _trackEvent(categoryParam, actionParam, labelParam);
      }, 250);
    }
  }

  var gaProvider = {};

  gaProvider.analyticsRunning = false;

  /**
   * @ngdoc method
   * @name UtilsModule.GoogleAnalytics:isMobile
   * @methodOf UtilsModule.service:GoogleAnalytics
   *
   * @description
   * Funciones internas - detecta plataforma de uso.
   *
   *
   */
  gaProvider.isMobile = function() {
    return !(navigator.userAgent.match(/Macintosh/i) === 'Macintosh' ||
      navigator.userAgent.match(/Windows/i) === 'Windows' ||
      navigator.userAgent.match(/Unix/i) === 'Unix');
  };

  /**
   * @ngdoc method
   * @name UtilsModule.GoogleAnalytics:startAnalytics
   * @methodOf UtilsModule.service:GoogleAnalytics
   *
   * @description
   * Inicializa el módulo de GAI con el id especificado en app
   *
   *
   */
  gaProvider.startAnalytics = function() {
    //Inicializa el módulo de GAI con el id especificado en app
    if (gaProvider.isMobile()) {
      if (typeof window.analytics !== 'undefined') {
        //TODO ADD DYNAMIC ID
        window.analytics.startTrackerWithId('UA-73813005-1');
        window.analytics.debugMode();
        gaProvider.analyticsRunning = true;
      } else {
        //TODO THROW/CATCH ERROR
        $log.log('Analytics no inicializado');
      }
    } else {
      /*Google analytics para web se inicia de forma global en index
      Esto es necesario para poder usarlo a través de toda la app,
      dado que si usamos sólo angulartics
      no es posible hacer track de los screens, sólo de pageviews.
      */
    }
  };


  /**
   * @ngdoc method
   * @name UtilsModule.GoogleAnalytics:trackView
   * @methodOf UtilsModule.service:GoogleAnalytics
   *
   * @description
   * trackView hace la función de hacer un tracking de Screen Name
   * No confundir con pageTrack (se le ha llamado trackView por similitud con el plugin GA cordova).
   *
   * @param {object} viewName - nombre de la vista/seccion/pantalla .
   */
  gaProvider.trackView = function(viewName) {
    if (gaProvider.isMobile()) {
      _trackView(viewName);
    } else {
      /*
       * Posibles parámetros configurables:
       * Field Name	    ValueType	Required	Description
          appId	        text	    no	        The Id of the application.
          appVersion	    text	    no	        The application version.
          appInstallerId	text	    no	        The Id of the application installer.
       * */
      ga('send', 'screenview', {
        'screenName': viewName
      });
    }
  };

  /*
   * trackEvent permite registrar eventos con las tres dimensiones que se usan para esta menu.tabs.
   * */
  /**
   * @ngdoc method
   * @name UtilsModule.GoogleAnalytics:trackView
   * @methodOf UtilsModule.service:GoogleAnalytics
   *
   * @description
   * trackEvent permite registrar eventos con las tres dimensiones que se usan para esta menu.tabs.
   *
   * @param {object} categoryParam - nombre de la categoria.
   * @param {object} actionParam - nombre de la accion.
   * @param {object} labelParam - label de la accion.
   */
  gaProvider.trackEvent = function(categoryParam, actionParam, labelParam) {
    labelParam = labelParam || '';
    if (gaProvider.isMobile()) {
      _trackEvent(categoryParam, actionParam, labelParam);
    } else {
      /*
      * Field Name	Value Type	Required	Description
          eventCategory	text	yes	        Typically the object that was interacted with (e.g. 'Video')
          eventAction	    text	yes	        The type of interaction (e.g. 'play')
          eventLabel	    text	no	        Useful for categorizing events (e.g. 'Fall Campaign')
       */
      ga('send', {
        hitType: 'event',
        eventCategory: categoryParam,
        eventAction: actionParam,
        eventLabel: labelParam
      });
      $log.log('Tracked event');
    }
  };

  return gaProvider;
}]);