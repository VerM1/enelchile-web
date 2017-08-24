/**
 * @ngdoc service
 * @name AnaliticaModule.service:AnaliticaFactory
 * @description
 * Factory que controla todo lo relaccionado al modulo Acceso: Funcion de Login, recuperacion de contraseña,
 * y login para prepagos por SMS.
 * @param  {provider} AnaliticaProvider - Provider con llamadas a google analytics.
 **/
angular.module('AnalyticsModule').factory('AnalyticsService', ['AnalyticsProvider', function(AnaliticaProvider) {
  return {
    /**
     * @ngdoc method
     * @name AnaliticaModule.AnaliticaFactory:evento
     * @methodOf AnaliticaModule.service:AnaliticaFactory
     *
     * @description
     * Envia datos de analytics en caso de evento.
     *
     * @param {object} etiqueta - etiqueta de accion.
     * @param {object} categoria - categoria de la accion.
     * @param {object} accion - descripcion de la accion.
     *
     */

    evento: function(categoria, accion) {
      AnaliticaProvider.evento(categoria, accion);
    },

    /**
     * @ngdoc method
     * @name AnaliticaModule.AnaliticaFactory:pantalla
     * @methodOf AnaliticaModule.service:AnaliticaFactory
     *
     * @description
     * Envia datos de analytics en caso de entrar a una nueva pantalla.
     *
     * @param {object} pantalla - nombre de la pantalla.
     *
     */

    pantalla: function(pantalla) {
      AnaliticaProvider.pantalla(pantalla);
    }
  };
}]);