/**
 * Created by rodrigopalmafanjul on 17-05-17.
 */
/**
 * @ngdoc service
 * @name UtilsModule.service:DataMapService
 * @description
 * Factory que guarda pares key/value
 *
 **/
angular.module('CoreModule').service('DataMapService', function() {
  var vars = [];
  /**
   * @ngdoc method
   * @name UtilsModule.DataMapService:setItem
   * @methodOf UtilsModule.service:DataMapService
   *
   * @description
   * Guarda un valor en el mapa que contiene
   *
   * @param {object} key - clave del valor a guardar
   * @param {object} value - valor a guardar
   *
   */
  var setItem = function(key, value) {
    if (key) {
      vars[key] = value;
      return value;
    } else {
      throw "setItem: key and value is needed";
    }
  };
  /**
   * @ngdoc method
   * @name UtilsModule.DataMapService:setItem
   * @methodOf UtilsModule.service:DataMapService
   *
   * @description
   * Obtiene un valor desde el mapa.
   *
   * @param {object} key - clave del valor a buscar
   * @param {object} allowNulls - True si se desea que retorne null al no existir el elemento, false para lanzar error.
   *
   * @returns {object} valor asignado a la key
   */
  var getItem = function(key, allowNulls) {
    if (!key) {
      throw "getItem: key is needed";
    }
    if (typeof vars[key] !== 'undefined') {
      return vars[key];
    } else {
      if (!allowNulls) {
        throw "Item not found";
      } else return null;

    }
  };


  var deleteItem = function(key) {
    if (!key) {
      throw "deleteItem: key is needed";
    }
    if (typeof vars[key] !== 'undefined') {
      delete vars[key];
    }
  };

  return {
    setItem: setItem,
    getItem: getItem,
    deleteItem: deleteItem
  };
});