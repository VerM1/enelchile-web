angular.module('CoreModule').factory('UtilsService', function(SalesforceProvider, $q, ENDPOINTS, $log, SALESFORCE_CONFIG, LocalStorageProvider, ConnectionProvider, $rootScope, AccessService, $state, $route, $ionicLoading, $window) {

  pub = {};


  pub.getStates = function() {
    var defer = $q.defer();
    if (LocalStorageProvider.getLocalStorageItem("states") && LocalStorageProvider.getLocalStorageItem("states").length > 0) {
      defer.resolve(LocalStorageProvider.getLocalStorageItem("states"));
      $log.debug('getStates: ', LocalStorageProvider.getLocalStorageItem("states"));
    } else {
      var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_GET_STATES;
      var params = {};
      var data = {};
      var headers = {
        'Content-type': 'application/json'
      };
      ConnectionProvider.sendGet(url, params, data, headers, function(response) {
        if (response.code == 200) {
          $log.debug('Get getStates: ', response.data);
          var obj = [];
          $log.debug("largo: ", response.data.length);
          for (var i = 0; i < response.data.length; i++) {
            obj.push(response.data[i]);
          }
          LocalStorageProvider.setLocalStorageItem("states", obj);
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
          LocalStorageProvider.setLocalStorageItem("last_request_sf_time_states", actualDate);
          defer.resolve(obj);
        } else {
          $log.error('Error getStates: ' + response.message);
          var obj = {};
          obj.code = response.code;
          obj.message = response.message;
          if (response.analyticsCode) {
            obj.analyticsCode = respuesta.analyticsCode;
          } else {
            obj.analyticsCode = "ERR999";
          }
          defer.reject(obj);
        }
      }, function(err) {
        $log.error('Error getStates: ' + err);
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

  //  PRIVATE SERVICES
  pub.getAssetList = function() {
    var defer = $q.defer();
    if (LocalStorageProvider.getLocalStorageItem('asset_list')) {
      defer.resolve(LocalStorageProvider.getLocalStorageItem('asset_list'));
      LocalStorageProvider.setLocalStorageItem('asset_list_is_new_request', "false");
    } else {
      var obj = {};
      obj.path = ENDPOINTS.ENDPOINTS_ASSESTS_LIST;
      obj.method = 'GET';
      obj.contentType = 'application/json';
      obj.params = {};
      obj.data = '';

      SalesforceProvider.request(obj).then(function(respuesta) {
        if (respuesta.code.toString() == "200") {
          $log.debug("getAssetList ", respuesta.data);
          var items = [];
          if (respuesta.data != null && respuesta.data.length > 0) {
            angular.forEach(respuesta.data, function(value, key) {
              $log.debug(key + ' : ', value);
              var data = {};
              data.index = key;
              data.direccion = value.direccion.direccion;
              if (value.direccion.comuna && value.direccion.comuna != null && value.direccion.comuna != "") {
                data.direccion = data.direccion + " " + value.direccion.comuna;
                data.comuna = value.direccion.comuna;
              }
              data.numeroSuministro = value.numeroSuministro;
              data.numeroSuministroDv = value.numeroSuministro + "-" + value.digitoVerificador;
              items.push(data);
            });
          }
          LocalStorageProvider.setLocalStorageItem('asset_list', items);
          LocalStorageProvider.setLocalStorageItem('asset_list_is_new_request', "true");
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
          LocalStorageProvider.setLocalStorageItem("last_request_sf_time_user_data", actualDate);
          defer.resolve(items);
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
        $log.error('Error AssetList: ', err);
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
  };



  //  PUBLIC SERVICES

  pub.getAssetDebt = function(assetNumber) {
    var defer = $q.defer();
    if (LocalStorageProvider.getLocalStorageItem('asset_debt_')) {
      defer.resolve(LocalStorageProvider.getLocalStorageItem('asset_debt_'));
    } else {
      var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_GET_ASSET_DEBT;
      var params = {
        'numeroSuministro': assetNumber
      };
      var data = {};
      var headers = {
        'Content-type': 'application/json'
      };

      ConnectionProvider.sendGet(url, params, data, headers, function(respuesta) {
        if (respuesta.code.toString() == "200") {
          $log.debug("getAssetList ", respuesta.data);
          var obj = {};
          LocalStorageProvider.setLocalStorageItem('asset_debt_', respuesta.data);
          defer.resolve(respuesta.data);
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
        $log.error('Error AssetList: ', err);
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
  };


  pub.getSubjectList = function() {
    var defer = $q.defer();
    if (LocalStorageProvider.getLocalStorageItem('subject_list')) {
      defer.resolve(LocalStorageProvider.getLocalStorageItem('subject_list'));
    } else {
      var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_EXTERNAL_SUBJECT;
      var params = {};
      var data = {};
      var headers = {
        'Content-type': 'application/json'
      };

      ConnectionProvider.sendGet(url, params, data, headers, function(respuesta) {
        if (respuesta.code.toString() == "200") {
          $log.debug("getAssetList ", respuesta.data);
          LocalStorageProvider.setLocalStorageItem('subject_list', respuesta.data);
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
          LocalStorageProvider.setLocalStorageItem("last_request_sf_time_subject_list", actualDate);
          defer.resolve(respuesta.data);
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
        $log.error('Error AssetList: ', err);
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
  };


  pub.setXID = function(xid, platform) {
    var defer = $q.defer();

    var obj = {};
    obj.path = ENDPOINTS.ENDPOINTS_REGISTER_XID_DEVICE;
    obj.method = 'POST';
    obj.contentType = 'application/json';
    obj.data = {
      bean: {
        xid: xid,
        so: platform
      }
    };
    obj.params = '';

    SalesforceProvider.request(obj).then(function(respuesta) {
      if (respuesta.code.toString() == "200") {
        $log.debug("Set XID ", respuesta);
        defer.resolve(respuesta);
      } else {
        $log.error('Error Set XID: ', respuesta.message);
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
      $log.error('Error Set XID: ', err.message);
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

  pub.setBadgeNumber = function(count) {
    try {
      $log.info('COUNT: ' + count);
      if ($rootScope.push) {
        $rootScope.push.setApplicationIconBadgeNumber(function() {}, function() {}, count);
      }
    } catch (e) {
      $log.error("Error al set BadgeNumber: ", e);
    }
  };


  // !!!!!++**++ ADMINISTRACION DE TODO EL LOCALSTORAGE ++**++!!!!
  pub.manageLocalStorageWhenRunApp = function() {
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
    // se validara las sucursales
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_branches")) {
      var dateAux1 = new Date(actualDate).getTime();
      var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_branches")).getTime();
      var thirtyDaysInMilliseconds = 2592000000;
      if (dateAux1 - dateAux2 > thirtyDaysInMilliseconds) {
        LocalStorageProvider.removeLocalStorageItem("branches");
        LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_branches");
      }
    }

    //se validará los destacados.
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_featured")) {
      var dateAux1 = new Date(actualDate).getTime();
      var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_featured")).getTime();
      if (dateAux1 != dateAux2) {
        LocalStorageProvider.removeLocalStorageItem("featured_list");
        LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_featured");
      }
    }

    // se validara los tipos de corte de luz
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_blackout_problems")) {
      var dateAux1 = new Date(actualDate).getTime();
      var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_blackout_problems")).getTime();
      var thirtyDaysInMilliseconds = 2592000000;
      if (dateAux1 - dateAux2 > thirtyDaysInMilliseconds) {
        LocalStorageProvider.removeLocalStorageItem("blackout_list");
        LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_blackout_problems");
      }
    }

    // se validara los tipos de alumbrado publico
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_lighting_problems")) {
      var dateAux1 = new Date(actualDate).getTime();
      var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_lighting_problems")).getTime();
      var thirtyDaysInMilliseconds = 2592000000;
      if (dateAux1 - dateAux2 > thirtyDaysInMilliseconds) {
        LocalStorageProvider.removeLocalStorageItem("lighting_list");
        LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_lighting_problems");
      }
    }

    // se validara los tipos de riesgo y accidentes
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_accident_risk_problems")) {
      var dateAux1 = new Date(actualDate).getTime();
      var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_accident_risk_problems")).getTime();
      var thirtyDaysInMilliseconds = 2592000000;
      if (dateAux1 - dateAux2 > thirtyDaysInMilliseconds) {
        LocalStorageProvider.removeLocalStorageItem("risk_accident_list");
        LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_accident_risk_problems");
      }
    }

    // se validara los tipos de contacto
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_subject_list")) {
      var dateAux1 = new Date(actualDate).getTime();
      var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_subject_list")).getTime();
      var thirtyDaysInMilliseconds = 2592000000;
      if (dateAux1 - dateAux2 >= thirtyDaysInMilliseconds) {
        LocalStorageProvider.removeLocalStorageItem("subject_list");
        LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_subject_list");
      }
    }

    // se validara las comunas
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_states")) {
      var dateAux1 = new Date(actualDate).getTime();
      var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_states")).getTime();
      var thirtyDaysInMilliseconds = 2592000000;
      if (dateAux1 - dateAux2 >= thirtyDaysInMilliseconds) {
        LocalStorageProvider.removeLocalStorageItem("states");
        LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_states");
      }
    }

    //Mostrar icono de rotacion
    if (LocalStorageProvider.getLocalStorageItem('show_rotate_icon')) {
      $rootScope.showRotateIcon = false;
    }

    //se validara los datos de usuario autenticado en sf
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_user_data")) {
      var dateAux1 = new Date(actualDate).getTime();
      var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_user_data")).getTime();
      if (dateAux1 != dateAux2) {
        LocalStorageProvider.removeLocalStorageIfStartWith("asset_");
        LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_user_data");
      }
    }
    // FIN ADMINISTRACION DE TODO EL LOCALSTORAGE
  }

  // !!!!!++**++ ADMINISTRACION DE TODO EL LOCALSTORAGE ++**++!!!!
  pub.manageLocalStorageWhenPauseApp = function() {
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
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_branches")) {
      var dateAux1 = new Date(actualDate).getTime();
      var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_branches")).getTime();
      var thirtyDaysInMilliseconds = 2592000000;
      if (dateAux1 - dateAux2 > thirtyDaysInMilliseconds) {
        LocalStorageProvider.removeLocalStorageItem("branches");
        LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_branches");
      }
    }

    //se validará los destacados.
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_featured")) {
      var dateAux1 = new Date(actualDate).getTime();
      var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_featured")).getTime();
      if (dateAux1 != dateAux2) {
        LocalStorageProvider.removeLocalStorageItem("featured_list");
        LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_featured");
      }
    }

    // se validara los tipos de corte de luz
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_blackout_problems")) {
      var dateAux1 = new Date(actualDate).getTime();
      var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_blackout_problems")).getTime();
      var thirtyDaysInMilliseconds = 2592000000;
      if (dateAux1 - dateAux2 > thirtyDaysInMilliseconds) {
        LocalStorageProvider.removeLocalStorageItem("blackout_list");
        LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_blackout_problems");
      }
    }

    // se validara los tipos de alumbrado publico
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_lighting_problems")) {
      var dateAux1 = new Date(actualDate).getTime();
      var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_lighting_problems")).getTime();
      var thirtyDaysInMilliseconds = 2592000000;
      if (dateAux1 - dateAux2 > thirtyDaysInMilliseconds) {
        LocalStorageProvider.removeLocalStorageItem("lighting_list");
        LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_lighting_problems");
      }
    }

    // se validara los tipos de riesgo y accidentes
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_accident_risk_problems")) {
      var dateAux1 = new Date(actualDate).getTime();
      var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_accident_risk_problems")).getTime();
      var thirtyDaysInMilliseconds = 2592000000;
      if (dateAux1 - dateAux2 > thirtyDaysInMilliseconds) {
        LocalStorageProvider.removeLocalStorageItem("risk_accident_list");
        LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_accident_risk_problems");
      }
    }

    // se validara los tipos de contacto
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_subject_list")) {
      var dateAux1 = new Date(actualDate).getTime();
      var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_subject_list")).getTime();
      var thirtyDaysInMilliseconds = 2592000000;
      if (dateAux1 - dateAux2 >= thirtyDaysInMilliseconds) {
        LocalStorageProvider.removeLocalStorageItem("subject_list");
        LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_subject_list");
      }
    }

    // se validara las comunas
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_states")) {
      var dateAux1 = new Date(actualDate).getTime();
      var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_states")).getTime();
      var thirtyDaysInMilliseconds = 2592000000;
      if (dateAux1 - dateAux2 >= thirtyDaysInMilliseconds) {
        LocalStorageProvider.removeLocalStorageItem("states");
        LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_states");
      }
    }

    //Mostrar icono de rotacion
    if (LocalStorageProvider.getLocalStorageItem('show_rotate_icon')) {
      $rootScope.showRotateIcon = false;
    }


    //se validara los datos de usuario autenticado en sf
    if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_user_data")) {
      var dateAux1 = new Date(actualDate).getTime();
      var dateAux2 = new Date(LocalStorageProvider.getLocalStorageItem("last_request_sf_time_user_data")).getTime();
      if (dateAux1 != dateAux2) {
        LocalStorageProvider.removeLocalStorageIfStartWith("asset_");
        LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_user_data");
      }
    }
  }

  pub.manageLocalStorageWhenUpdateApp = function(version) {
    if (LocalStorageProvider.getLocalStorageItem("app_version")) {
      if (version !== LocalStorageProvider.getLocalStorageItem("app_version")) {
        if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_branches")) {
          LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_branches");
          LocalStorageProvider.removeLocalStorageItem("branches");
        }

        if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_featured")) {
          LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_featured");
          LocalStorageProvider.removeLocalStorageItem("featured_list");
        }

        if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_blackout_problems")) {
          LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_blackout_problems");
          LocalStorageProvider.removeLocalStorageItem("blackout_list");
        }

        if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_lighting_problems")) {
          LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_lighting_problems");
          LocalStorageProvider.removeLocalStorageItem("lighting_list");
        }

        if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_accident_risk_problems")) {
          LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_accident_risk_problems");
          LocalStorageProvider.removeLocalStorageItem("risk_accident_list");
        }

        if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_subject_list")) {
          LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_subject_list");
          LocalStorageProvider.removeLocalStorageItem("subject_list");
        }

        if (LocalStorageProvider.getLocalStorageItem("last_request_sf_time_states")) {
          LocalStorageProvider.removeLocalStorageItem("last_request_sf_time_states");
          LocalStorageProvider.removeLocalStorageItem("states");
        }

        if (LocalStorageProvider.getLocalStorageItem("pass_tuto")) {
          LocalStorageProvider.removeLocalStorageItem("pass_tuto");
        }

        if (LocalStorageProvider.getLocalStorageItem("show_rotate_icon")) {
          LocalStorageProvider.removeLocalStorageItem("show_rotate_icon");
        }
        LocalStorageProvider.setLocalStorageItem("app_version", version);
      }
    } else {
      LocalStorageProvider.setLocalStorageItem("app_version", version);
    }
  }
  // !!!!!++**++ FIN ADMINISTRACION DE TODO EL LOCALSTORAGE ++**++!!!!


  // service implementation
  pub.PagerService = function(totalItems, currentPage, pageSize) {
    // default to first page
    currentPage = currentPage || 1;

    // default page size is 10
    pageSize = pageSize || 10;

    // calculate total pages
    var totalPages = window.Math.ceil(totalItems / pageSize);

    var startPage, endPage;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = window.Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    // var pages = _.range(startPage, endPage + 1);
    var pages = "";
    if (totalPages >= 5) {
      pages = _.range(startPage, endPage + 1);
    } else {
      pages = _.range(totalPages);
    }

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

  return pub;
})