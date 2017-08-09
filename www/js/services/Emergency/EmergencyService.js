angular.module('EmergencyModule').factory('EmergencyService', function($q, ConnectionProvider, SalesforceProvider, $log, ENDPOINTS, LocalStorageProvider) {

  pub = {};
  //PUBLIC SERVICES
  pub.emergencyLightCut = function(numeroSuministro, siniestro, tipoDeProblema, nombre, apellidos, email, telefono) {
    var defer = $q.defer();
    var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_EXTERNAL_EMERGENCY_BLACKOUT;
    var data = {
      bean: {
        numeroSuministro: numeroSuministro,
        tipoDeProblema: tipoDeProblema,
        siniestro: siniestro,
        nombre: nombre,
        apellidos: apellidos,
        email: email,
        telefono: telefono
      }
    };
    var params = {};
    var headers = {
      'Content-type': 'application/json'
    };
    ConnectionProvider.sendPost(url, params, data, headers, function(respuesta) {
      if (respuesta.code.toString() == "200") {
        $log.debug('Get Data: ', respuesta);
        defer.resolve(respuesta.data);
      } else {
        $log.error('Error Get Data: ' + respuesta.message);
        var obj = {};
        obj.code = respuesta.code;
        obj.message = respuesta.message;
        defer.reject(obj);
      }
    }, function(err) {
      $log.error('Error Get Data: ' + err.message);
      var obj = {};
      if (err[0]) {
        obj.code = err[0].errorCode;
        obj.message = err[0].message;
      } else if (err.code) {
        obj.code = err.code;
        obj.message = err.message;
      } else if (err.data) {
        obj.code = err.data.status;
        obj.message = err.data.msg;
      } else {
        obj.code = "400";
        obj.message = err;
      }
      defer.reject(obj);
    });

    return defer.promise;
  };

  pub.emergencyLightingProblem = function(tipoDeProblema, calle, numero, departamento, comuna, nombre, apellidos, email, telefonoFijo, telefonoMovil, siniestro) {
    var defer = $q.defer();
    var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_EXTERNAL_EMERGENCY_LIGHTING_PROBLEM;
    var data = {
      bean: {
        tipoDeProblema: tipoDeProblema,
        calle: calle,
        numero: numero,
        departamento: departamento,
        comuna: comuna,
        nombre: nombre,
        apellidos: apellidos,
        email: email,
        telefonoFijo: telefonoFijo,
        telefonoSegundario: telefonoMovil,
        siniestro: siniestro
      }

    };
    var params = {};
    var headers = {
      'Content-type': 'application/json'
    };
    ConnectionProvider.sendPost(url, params, data, headers, function(respuesta) {
      if (respuesta.code.toString() == "200") {
        $log.debug('Get Data: ', respuesta);
        defer.resolve(respuesta.data);
      } else {
        $log.error('Error Get Data: ' + respuesta.message);
        var obj = {};
        obj.code = respuesta.code;
        obj.message = respuesta.message;
        defer.reject(obj);
      }

    }, function(err) {
      $log.error('Error Get Data: ' + err.message);
      var obj = {};
      if (err[0]) {
        obj.code = err[0].errorCode;
        obj.message = err[0].message;
      } else if (err.code) {
        obj.code = err.code;
        obj.message = err.message;
      } else if (err.data) {
        obj.code = err.data.status;
        obj.message = err.data.msg;
      } else {
        obj.code = "400";
        obj.message = err;
      }
      defer.reject(obj);
    });

    return defer.promise;

  };

  pub.emergencyRiskAccident = function(tipoDeProblema, calle, numero, departamento, comuna, nombre, apellidos, email, telefonoFijo, telefonoMovil, siniestro) {
    var defer = $q.defer();
    var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_EXTERNAL_EMERGENCY_RISK_ACCIDENT;
    var data = {
      bean: {
        tipoDeProblema: tipoDeProblema,
        calle: calle,
        numero: numero,
        departamento: departamento,
        comuna: comuna,
        nombre: nombre,
        apellidos: apellidos,
        email: email,
        telefonoFijo: telefonoFijo,
        telefonoSegundario: telefonoMovil,
        siniestro: siniestro
      }

    };
    var params = {};
    var headers = {
      'Content-type': 'application/json'
    };
    ConnectionProvider.sendPost(url, params, data, headers, function(respuesta) {
      if (respuesta.code.toString() == "200") {
        $log.debug('Get Data: ', respuesta);
        defer.resolve(respuesta.data);
      } else {
        $log.error('Error Get Data: ' + respuesta.message);
        var obj = {};
        obj.code = respuesta.code;
        obj.message = respuesta.message;
        defer.reject(obj);
      }

    }, function(err) {
      $log.error('Error Get Data: ' + err.message);
      var obj = {};
      if (err[0]) {
        obj.code = err[0].errorCode;
        obj.message = err[0].message;
      } else if (err.code) {
        obj.code = err.code;
        obj.message = err.message;
      } else if (err.data) {
        obj.code = err.data.status;
        obj.message = err.data.msg;
      } else {
        obj.code = "400";
        obj.message = err;
      }
      defer.reject(obj);
    });

    return defer.promise;
  };


  pub.getBlackoutProblemsList = function() {
    var defer = $q.defer();
    if (LocalStorageProvider.getLocalStorageItem("blackout_list") && LocalStorageProvider.getLocalStorageItem("blackout_list").length > 0) {
      defer.resolve(LocalStorageProvider.getLocalStorageItem("blackout_list"));
      $log.info('getBlakcoutList: ', LocalStorageProvider.getLocalStorageItem("blackout_list"));
    } else {
      var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_BLACKOUT_PROBLEMS_LIST;
      var params = {};
      var data = {};
      var headers = {
        'Content-type': 'application/json'
      };
      ConnectionProvider.sendGet(url, params, data, headers, function(response) {
        if (response.code == 200) {
          $log.info('Get getBlackoutList: ', response.data);
          var obj = [];
          $log.info("largo: ", response.data.length);
          for (var i = 0; i < response.data.length; i++) {
            obj.push(response.data[i]);
          }
          LocalStorageProvider.setLocalStorageItem("blackout_list", obj);
          defer.resolve(obj);
        } else {
          $log.error('Error getBlackoutList: ' + response.message);
          var obj = {};
          obj.code = response.code;
          obj.message = response.message;
          defer.reject(obj);
        }

      }, function(err) {
        $log.error('Error getBlackoutList: ' + err);
        var obj = {};
        if (err[0]) {
          obj.code = err[0].errorCode;
          obj.message = err[0].message;
        } else if (err.code) {
          obj.code = err.code;
          obj.message = err.message;
        } else if (err.data) {
          obj.code = err.data.status;
          obj.message = err.data.msg;
        } else {
          obj.code = "400";
          obj.message = err;
        }
        defer.reject(obj);
      });
    }
    return defer.promise;
  }


  pub.getLightingProblemsList = function() {
    var defer = $q.defer();
    if (LocalStorageProvider.getLocalStorageItem("lighting_list") && LocalStorageProvider.getLocalStorageItem("lighting_list").length > 0) {
      defer.resolve(LocalStorageProvider.getLocalStorageItem("lighting_list"));
      $log.info('getLightingList: ', LocalStorageProvider.getLocalStorageItem("lighting_list"));
    } else {
      var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_LIGHTING_PROBLEMS_LIST;
      var params = {};
      var data = {};
      var headers = {
        'Content-type': 'application/json'
      };
      ConnectionProvider.sendGet(url, params, data, headers, function(response) {
        if (response.code == 200) {
          $log.info('Get getLightingList: ', response.data);
          var obj = [];
          $log.info("largo: ", response.data.length);
          for (var i = 0; i < response.data.length; i++) {
            obj.push(response.data[i]);
          }
          LocalStorageProvider.setLocalStorageItem("lighting_list", obj);
          defer.resolve(obj);
        } else {
          $log.error('Error getLightingList: ' + response.message);
          var obj = {};
          obj.code = response.code;
          obj.message = response.message;
          defer.reject(obj);
        }

      }, function(err) {
        $log.error('Error getLightingList: ' + err);
        var obj = {};
        if (err[0]) {
          obj.code = err[0].errorCode;
          obj.message = err[0].message;
        } else if (err.code) {
          obj.code = err.code;
          obj.message = err.message;
        } else if (err.data) {
          obj.code = err.data.status;
          obj.message = err.data.msg;
        } else {
          obj.code = "400";
          obj.message = err;
        }
        defer.reject(obj);
      });
    }
    return defer.promise;
  }


  pub.getRiskAccidentProblemsList = function() {
    var defer = $q.defer();
    if (LocalStorageProvider.getLocalStorageItem("risk_accident_list") && LocalStorageProvider.getLocalStorageItem("risk_accident_list").length > 0) {
      defer.resolve(LocalStorageProvider.getLocalStorageItem("risk_accident_list"));
      $log.info('getRiskAccidentList: ', LocalStorageProvider.getLocalStorageItem("risk_accident_list"));
    } else {
      var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_RISK_ACCIDENT_PROBLEMS_LIST;
      var params = {};
      var data = {};
      var headers = {
        'Content-type': 'application/json'
      };
      ConnectionProvider.sendGet(url, params, data, headers, function(response) {
        if (response.code == 200) {
          $log.info('Get getRiskAccidentList: ', response.data);
          var obj = [];
          $log.info("largo: ", response.data.length);
          for (var i = 0; i < response.data.length; i++) {
            obj.push(response.data[i]);
          }
          LocalStorageProvider.setLocalStorageItem("risk_accident_list", obj);
          defer.resolve(obj);
        } else {
          $log.error('Error getRiskAccidentList: ' + response.message);
          var obj = {};
          obj.code = response.code;
          obj.message = response.message;
          defer.reject(obj);
        }

      }, function(err) {
        $log.error('Error getRiskAccidentList: ' + err);
        var obj = {};
        if (err[0]) {
          obj.code = err[0].errorCode;
          obj.message = err[0].message;
        } else if (err.code) {
          obj.code = err.code;
          obj.message = err.message;
        } else if (err.data) {
          obj.code = err.data.status;
          obj.message = err.data.msg;
        } else {
          obj.code = "400";
          obj.message = err;
        }
        defer.reject(obj);
      });
    }
    return defer.promise;
  }


  //PRIVATE SERVICES
  pub.emergencyLightCutAuth = function(numeroSuministro, siniestro, tipoDeProblema) {
    var defer = $q.defer();

    var obj = {};
    obj.path = ENDPOINTS.ENDPOINTS_EMERGENCY_BLACKOUT;
    obj.method = 'POST';
    obj.contentType = 'application/json';
    obj.data = {
      bean: {
        numeroSuministro: numeroSuministro,
        siniestro: siniestro,
        tipoDeProblema: tipoDeProblema
      }

    };
    obj.params = '';

    SalesforceProvider.request(obj).then(function(respuesta) {
      if (respuesta.code.toString() == "200") {
        $log.info("RESPONSE EMERGENCY ", respuesta);
        defer.resolve(respuesta.data);
      } else {
        $log.error('Error AssetList: ', respuesta.message);
        var obj = {};
        obj.code = respuesta.code;
        obj.message = respuesta.message;
        defer.reject(obj);
      }
    }, function(err) {
      $log.error('Error AssetList: ', err.message);
      var obj = {};
      if (err[0]) {
        obj.code = err[0].errorCode;
        obj.message = err[0].message;
      } else if (err.code) {
        obj.code = err.code;
        obj.message = err.message;
      } else if (err.data) {
        obj.code = err.data.status;
        obj.message = err.data.msg;
      } else {
        obj.code = "400";
        obj.message = err;
      }
      defer.reject(obj);
    });

    return defer.promise;
  };

  pub.emergencyLightingProblemAuth = function(tipoDeProblema, calle, numero, departamento, comuna, siniestro) {
    var defer = $q.defer();

    var obj = {};
    obj.path = ENDPOINTS.ENDPOINTS_EMERGENCY_LIGHTING_PROBLEM;
    obj.method = 'POST';
    obj.contentType = 'application/json';
    obj.data = {
      bean: {
        tipoDeProblema: tipoDeProblema,
        siniestro: siniestro,
        calle: calle,
        numero: numero,
        departamento: departamento,
        comuna: comuna
      }

    };
    obj.param = '';

    SalesforceProvider.request(obj).then(function(respuesta) {
      if (respuesta.code.toString() == "200") {
        $log.info("RESPONSE EMERGENCY ", respuesta);
        defer.resolve(respuesta.data);
      } else {
        $log.error('Error AssetList: ', respuesta.message);
        var obj = {};
        obj.code = respuesta.code;
        obj.message = respuesta.message;
        defer.reject(obj);
      }

    }, function(err) {
      $log.error('Error AssetList: ', err.message);
      var obj = {};
      if (err[0]) {
        obj.code = err[0].errorCode;
        obj.message = err[0].message;
      } else if (err.code) {
        obj.code = err.code;
        obj.message = err.message;
      } else if (err.data) {
        obj.code = err.data.status;
        obj.message = err.data.msg;
      } else {
        obj.code = "400";
        obj.message = err;
      }
      defer.reject(obj);
    });

    return defer.promise;

  };

  pub.emergencyRiskAccidentAuth = function(tipoDeProblema, calle, numero, departamento, comuna, siniestro) {
    var defer = $q.defer();

    var obj = {};
    obj.path = ENDPOINTS.ENDPOINTS_EMERGENCY_RISK_ACCIDENT;
    obj.method = 'POST';
    obj.contentType = 'application/json';
    obj.data = {
      bean: {
        tipoDeProblema: tipoDeProblema,
        siniestro: siniestro,
        calle: calle,
        numero: numero,
        departamento: departamento,
        comuna: comuna
      }

    };
    obj.params = '';

    SalesforceProvider.request(obj).then(function(respuesta) {
      if (respuesta.code.toString() == "200") {
        $log.info("RESPONSE EMERGENCY ", respuesta);
        defer.resolve(respuesta.data);
      } else {
        $log.error('Error AssetList: ', respuesta.message);
        var obj = {};
        obj.code = respuesta.code;
        obj.message = respuesta.message;
        defer.reject(obj);
      }
    }, function(err) {
      $log.error('Error AssetList: ', err.message);
      var obj = {};
      if (err[0]) {
        obj.code = err[0].errorCode;
        obj.message = err[0].message;
      } else if (err.code) {
        obj.code = err.code;
        obj.message = err.message;
      } else if (err.data) {
        obj.code = err.data.status;
        obj.message = err.data.msg;
      } else {
        obj.code = "400";
        obj.message = err;
      }
      defer.reject(obj);
    });

    return defer.promise;

  };
  return pub;
});