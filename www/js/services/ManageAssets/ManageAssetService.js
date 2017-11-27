/**
 * Created by ngajardo on 12-12-2016.
 */
angular.module('ManageAssetModule').factory('ManageAssetService', function($q, ConnectionProvider, SalesforceProvider, LocalStorageProvider, $log, ENDPOINTS, UTILS_CONFIG) {

  pub = {};
  //PRIVATE SERVICES
  pub.addAsset = function(numeroSuministro, numeroBoleta, rol) {
    var defer = $q.defer();
    var obj = {};
    obj.path = ENDPOINTS.ENDPOINTS_ADD_ASSET;
    obj.method = 'POST';
    obj.contentType = 'application/json';
    obj.data = {
      bean: {
        numeroSuministro: numeroSuministro,
        numberTicket: numeroBoleta,
        rol: rol
      }
    };
    obj.params = '';

    SalesforceProvider.request(obj).then(function(respuesta) {
      if (respuesta.code.toString() == "200") {
        $log.debug("RESPONSE ADD ASSET", respuesta);
        var data = {};
        data.numeroSuministro = respuesta.data.numeroSuministro;
        data.numeroSuministroDv = respuesta.data.numeroSuministro;
        data.direccion = respuesta.data.direccion;
        data.comuna = respuesta.data.comuna;
        defer.resolve(data);
      } else {
        $log.error('Error Add Asset: ', respuesta.message);
        var obj = {};
        obj.code = respuesta.code;
        obj.message = respuesta.message;
        if (respuesta.analyticsCode) {
          obj.analyticsCode = respuesta.analyticsCode;
        } else {
          obj.analyticsCode = "ERR999";
        }
        defer.reject(obj);
      }
    }, function(err) {
      $log.error('Error Add Asset: ', err.message);
      var obj = {};
      if (err[0]) {
        obj.code = err[0].errorCode;
        obj.message = err[0].message;
        if (err[0].analyticsCode) {
          obj.analyticsCode = err[0].analyticsCode;
        } else {
          obj.analyticsCode = "ERR999";
        }
      } else if (err.code) {
        obj.code = err.code;
        obj.message = err.message;
        if (err.analyticsCode) {
          obj.analyticsCode = err.analyticsCode;
        } else {
          obj.analyticsCode = "ERR999";
        }
      } else if (err.data) {
        obj.code = err.data.status;
        obj.message = err.data.msg;
        if (err.data.analyticsCode) {
          obj.analyticsCode = err.data.analyticsCode;
        } else {
          obj.analyticsCode = "ERR999";
        }
      } else {
        obj.code = "400";
        obj.message = err;
        obj.analyticsCode = "ERR999";
      }
      defer.reject(obj);
    });
    return defer.promise;
  };

  return pub;
});