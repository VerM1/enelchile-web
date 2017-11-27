angular.module('EmergencyModule').factory('EmergencyService', function($q, ConnectionProvider, SalesforceProvider, $log, ENDPOINTS, LocalStorageProvider) {

  pub = {};
  //PUBLIC SERVICES
  pub.emergencyLightCut = function(numeroSuministro, siniestro, tipoDeProblema, nombre, apellidos, email, telefono, telefonoMovil) {
    var defer = $q.defer();
    var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_EXTERNAL_EMERGENCY_BLACKOUT;
    var data = {
      bean: {
        numeroSuministro: numeroSuministro,
        tipoDeProblema: tipoDeProblema,
        descripcion: siniestro,
        nombre: nombre,
        apellidos: apellidos,
        email: email,
        telefonoPrimario: telefono,
        telefonoSecundario: telefonoMovil
      }
    };
    var params = {};
    var headers = {
      'Content-type': 'application/json'
    };
    ConnectionProvider.sendPost(url, params, data, headers, function(respuesta) {
      if (respuesta.code.toString() == "200") {
        $log.debug('Get Data: ', respuesta);
        defer.resolve(respuesta);
      } else {
        $log.error('Error Get Data: ' + respuesta.message);
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
      $log.error('Error Get Data: ' + err.message);
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
        telefonoPrimario: telefonoFijo,
        telefonoSecundario: telefonoMovil,
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
        defer.resolve(respuesta);
      } else {
        $log.error('Error Get Data: ' + respuesta.message);
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
      $log.error('Error Get Data: ' + err.message);
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
        telefonoPrimario: telefonoFijo,
        telefonoSecundario: telefonoMovil,
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
        defer.resolve(respuesta);
      } else {
        $log.error('Error Get Data: ' + respuesta.message);
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
      $log.error('Error Get Data: ' + err.message);
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


  pub.getBlackoutProblemsList = function() {
    var defer = $q.defer();
    if (LocalStorageProvider.getLocalStorageItem("blackout_list") && LocalStorageProvider.getLocalStorageItem("blackout_list").length > 0) {
      defer.resolve(LocalStorageProvider.getLocalStorageItem("blackout_list"));
      $log.debug('getBlakcoutList: ', LocalStorageProvider.getLocalStorageItem("blackout_list"));
    } else {
      var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_BLACKOUT_PROBLEMS_LIST;
      var params = {};
      var data = {};
      var headers = {
        'Content-type': 'application/json'
      };
      ConnectionProvider.sendGet(url, params, data, headers, function(response) {
        if (response.code == 200) {
          $log.debug('Get getBlackoutList: ', response.data);
          var obj = [];
          $log.debug("largo: ", response.data.length);
          for (var i = 0; i < response.data.length; i++) {
            obj.push(response.data[i]);
          }
          LocalStorageProvider.setLocalStorageItem("blackout_list", obj);
          var actualDate = "";
          try {
            actualDate = moment().format("MM/DD/YYYY");
          } catch (exception) {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            if (dd < 10) {
              dd = '0' + dd
            }
            if (mm < 10) {
              mm = '0' + mm
            }
            today = mm + '/' + dd + '/' + yyyy;
            actualDate = today;
          }
          LocalStorageProvider.setLocalStorageItem("last_request_sf_time_blackout_problems", actualDate);
          defer.resolve(obj);
        } else {
          $log.error('Error getBlackoutList: ' + response.message);
          var obj = {};
          obj.code = response.code;
          obj.message = response.message;
          if (response.analyticsCode) {
            obj.analyticsCode = response.analyticsCode;
          } else {
            obj.analyticsCode = "ERR999";
          }
          defer.reject(obj);
        }
      }, function(err) {
        $log.error('Error getBlackoutList: ' + err);
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
    }
    return defer.promise;
  }


  pub.getLightingProblemsList = function() {
    var defer = $q.defer();
    if (LocalStorageProvider.getLocalStorageItem("lighting_list") && LocalStorageProvider.getLocalStorageItem("lighting_list").length > 0) {
      defer.resolve(LocalStorageProvider.getLocalStorageItem("lighting_list"));
      $log.debug('getLightingList: ', LocalStorageProvider.getLocalStorageItem("lighting_list"));
    } else {
      var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_LIGHTING_PROBLEMS_LIST;
      var params = {};
      var data = {};
      var headers = {
        'Content-type': 'application/json'
      };
      ConnectionProvider.sendGet(url, params, data, headers, function(response) {
        if (response.code == 200) {
          $log.debug('Get getLightingList: ', response.data);
          var obj = [];
          $log.debug("largo: ", response.data.length);
          for (var i = 0; i < response.data.length; i++) {
            obj.push(response.data[i]);
          }
          LocalStorageProvider.setLocalStorageItem("lighting_list", obj);
          var actualDate = "";
          try {
            actualDate = moment().format("MM/DD/YYYY");
          } catch (exception) {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            if (dd < 10) {
              dd = '0' + dd
            }
            if (mm < 10) {
              mm = '0' + mm
            }
            today = mm + '/' + dd + '/' + yyyy;
            actualDate = today;
          }
          LocalStorageProvider.setLocalStorageItem("last_request_sf_time_lighting_problems", actualDate);
          defer.resolve(obj);
        } else {
          $log.error('Error getLightingList: ' + response.message);
          var obj = {};
          obj.code = response.code;
          obj.message = response.message;
          if (response.analyticsCode) {
            obj.analyticsCode = response.analyticsCode;
          } else {
            obj.analyticsCode = "ERR999";
          }
          defer.reject(obj);
        }

      }, function(err) {
        $log.error('Error getLightingList: ' + err);
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
    }
    return defer.promise;
  }


  pub.getRiskAccidentProblemsList = function() {
    var defer = $q.defer();
    if (LocalStorageProvider.getLocalStorageItem("risk_accident_list") && LocalStorageProvider.getLocalStorageItem("risk_accident_list").length > 0) {
      defer.resolve(LocalStorageProvider.getLocalStorageItem("risk_accident_list"));
      $log.debug('getRiskAccidentList: ', LocalStorageProvider.getLocalStorageItem("risk_accident_list"));
    } else {
      var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_RISK_ACCIDENT_PROBLEMS_LIST;
      var params = {};
      var data = {};
      var headers = {
        'Content-type': 'application/json'
      };
      ConnectionProvider.sendGet(url, params, data, headers, function(response) {
        if (response.code == 200) {
          $log.debug('Get getRiskAccidentList: ', response.data);
          var obj = [];
          $log.debug("largo: ", response.data.length);
          for (var i = 0; i < response.data.length; i++) {
            obj.push(response.data[i]);
          }
          LocalStorageProvider.setLocalStorageItem("risk_accident_list", obj);
          var actualDate = "";
          try {
            actualDate = moment().format("MM/DD/YYYY");
          } catch (exception) {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            if (dd < 10) {
              dd = '0' + dd
            }
            if (mm < 10) {
              mm = '0' + mm
            }
            today = mm + '/' + dd + '/' + yyyy;
            actualDate = today;
          }
          LocalStorageProvider.setLocalStorageItem("last_request_sf_time_accident_risk_problems", actualDate);
          defer.resolve(obj);
        } else {
          $log.error('Error getRiskAccidentList: ' + response.message);
          var obj = {};
          obj.code = response.code;
          obj.message = response.message;
          if (response.analyticsCode) {
            obj.analyticsCode = response.analyticsCode;
          } else {
            obj.analyticsCode = "ERR999";
          }
          defer.reject(obj);
        }
      }, function(err) {
        $log.error('Error getRiskAccidentList: ' + err);
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
        descripcion: siniestro,
        tipoDeProblema: tipoDeProblema
      }

    };
    obj.params = '';

    SalesforceProvider.request(obj).then(function(respuesta) {
      if (respuesta.code.toString() == "200") {
        $log.debug("RESPONSE EMERGENCY ", respuesta);
        defer.resolve(respuesta);
      } else {
        $log.error('Error AssetList: ', respuesta.message);
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
      $log.error('Error AssetList: ', err.message);
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
        $log.debug("RESPONSE EMERGENCY ", respuesta);
        defer.resolve(respuesta);
      } else {
        $log.error('Error AssetList: ', respuesta.message);
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
      $log.error('Error AssetList: ', err.message);
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
        $log.debug("RESPONSE EMERGENCY ", respuesta);
        defer.resolve(respuesta);
      } else {
        $log.error('Error AssetList: ', respuesta.message);
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
      $log.error('Error AssetList: ', err.message);
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