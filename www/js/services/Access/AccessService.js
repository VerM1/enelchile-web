  angular.module('AccessModule').factory('AccessService',
    function(ConnectionProvider, SalesforceProvider, $q, ENDPOINTS, $log, SALESFORCE_CONFIG, LocalStorageProvider, $rootScope) {

      pub = {};
      // PUBLIC SERVICES
      pub.getDebtData = function(assetId) {
        var defer = $q.defer();
        var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_DEBT_DATA;
        var params = {
          'numeroSuministro': assetId
        };
        var data = {};
        var headers = {
          'Content-type': 'application/json'
        };
        ConnectionProvider.sendGet(url, params, data, headers, function(respuesta) {
          $log.debug('Get CommercialData: ', respuesta);
          if (respuesta.code.toString() == "200") {
            var items = [];
            if (respuesta.data != null && respuesta.data.length > 0) {
              angular.forEach(respuesta.data, function(value, key) {
                if (value.nroDocumento != null && value.nroDocumento.toString() != "0" && value.nroDocumento.toString() != "-1") {
                  $log.debug(key + ' : ', value);
                  var data = {};
                  data.index = key;
                  data.trxId = value.trxId;
                  data.tipoDocumento = value.tipoDocumento;
                  data.tipoDeuda = value.tipoDeuda;
                  data.publicidad = value.publicidad;
                  data.nroDocumento = value.nroDocumento;
                  data.nombre = value.nombre;
                  data.monto = value.monto;
                  data.mensaje = value.mensaje;
                  data.fechaVencimiento = value.fechaVencimiento;
                  data.fechaEmision = value.fechaEmision;
                  data.estado = value.estado;
                  data.direccion = value.direccion;
                  if (value.comuna) {
                    data.comuna = value.comuna;
                    data.direccion = data.direccion + " " + value.comuna;
                  }
                  data.consumo = value.consumo;
                  data.codigoBarra = value.codigoBarra;
                  items.push(data);
                } else {
                  $log.debug("el elemento ya fue pagado, no se incluira en la lista");
                }
              });
            }
            defer.resolve(items);
          } else {
            $log.error('Error CommercialData: ' + respuesta.message);
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
          $log.error('Error CommercialData: ' + err);
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
        })
        return defer.promise;
      }



      pub.getCommercialData = function(assetId) {
        var defer = $q.defer();
        var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_COMMERCIAL_DATA;
        var params = {
          'numeroSuministro': assetId
        };
        var data = {};
        var headers = {
          'Content-type': 'application/json'
        };
        ConnectionProvider.sendGet(url, params, data, headers, function(respuesta) {
          $log.debug('Get CommercialData: ', respuesta);
          if (respuesta.code.toString() == "200") {
            var obj = {};
            //VERSION NUEVA
            obj.codigoBarra = respuesta.data.codigoBarra;
            obj.consumo = respuesta.data.consumo;
            obj.digitoVerificador = respuesta.data.digitoVerificador;
            obj.direccion = respuesta.data.direccion.calle;
            if (respuesta.data.direccion.casa && respuesta.data.direccion.casa != null && respuesta.data.direccion.casa != "") {
              obj.direccion = obj.direccion + " " + respuesta.data.direccion.casa;
            }
            if (respuesta.data.direccion.departamento && respuesta.data.direccion.departamento != null && respuesta.data.direccion.departamento != "") {
              obj.direccion = obj.direccion + " " + respuesta.data.direccion.departamento;
            }
            if (respuesta.data.direccion.comuna && respuesta.data.direccion.comuna != null && respuesta.data.direccion.comuna != "") {
              obj.comuna = respuesta.data.direccion.comuna;
              obj.direccion = obj.direccion + " " + respuesta.data.direccion.comuna;
            }
            obj.estado = respuesta.data.estado;
            obj.fechaEmision = respuesta.data.fechaEmision;
            obj.fechaVencimiento = respuesta.data.fechaVencimiento;
            obj.idSuministro = respuesta.data.idSuministro;
            obj.mensaje = respuesta.data.mensaje;
            obj.monto = respuesta.data.monto;
            obj.nombre = respuesta.data.nombre;
            obj.nroDocumento = respuesta.data.nroDocumento;
            obj.numeroSuministro = respuesta.data.numeroSuministro;
            obj.publicidad = respuesta.data.publicidad;
            obj.tipoDeuda = respuesta.data.tipoDeuda;
            obj.tipoDocumento = respuesta.data.tipoDocumento;
            obj.trxId = respuesta.data.trxId;
            $log.debug("obj: ", obj);
            defer.resolve(obj);
          } else {
            $log.error('Error CommercialData: ' + respuesta.message);
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
          $log.error('Error CommercialData: ' + err);
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
        })
        return defer.promise;
      }





      //LOGIN CON SERVICIO
      pub.getLoginServices = function(userNumber, password, platform) {
        var defer = $q.defer();
        var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_GET_USER_SESSION;
        var params = {};
        var data = {
          bean: {
            rut: userNumber,
            password: password,
            //   sistema: platform
          }
        };
        var headers = {
          'Content-type': 'application/json'
        };
        ConnectionProvider.sendPost(url, params, data, headers, function(respuesta) {
          $log.debug('Get User Session: ', respuesta);
          if (respuesta.code.toString() == "200") {
            var obj = {};
            //   var loginData = {};
            obj.rut = userNumber;
            obj.password = password;
            obj.userId = respuesta.data.userId;
            obj.telefonoMovil = respuesta.data.telefonoMovil;
            obj.telefonoFijo = respuesta.data.telefonoFijo;
            obj.sessionId = respuesta.data.sessionId;
            obj.notificaciones = respuesta.data.notificaciones;
            obj.activarNotificaciones = respuesta.data.activarNotificaciones;
            obj.nombre = respuesta.data.nombre;
            obj.email = respuesta.data.email;
            obj.contactId = respuesta.data.contactId;
            obj.apellidoPaterno = respuesta.data.apellidoPaterno;
            obj.apellidoMaterno = respuesta.data.apellidoMaterno;
            LocalStorageProvider.setLocalStorageItem("USER_DATA", obj);
            SALESFORCE_CONFIG.accessToken = obj.sessionId;
            SALESFORCE_CONFIG.loginURL = ENDPOINTS.ENDPOINTS_SALESFORCE;
            SALESFORCE_CONFIG.proxyURL = ENDPOINTS.ENDPOINTS_SALESFORCE;
            LocalStorageProvider.setLocalStorageItem("SALESFORCE_CONFIG", SALESFORCE_CONFIG);
            force.init(SALESFORCE_CONFIG);
            defer.resolve(obj);
          } else {
            $log.error('Error CommercialData: ' + respuesta.message);
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
          $log.error('Error CommercialData: ' + err);
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
        })
        return defer.promise;
      };



      pub.getLogout = function() {
        try {
          force.discardToken();
          var exception = [];
          exception.push("branches");
          exception.push("no_session_client_number");
          exception.push("no_session_form_data");
          exception.push("pass_tuto");
          exception.push("show_rotate_icon");
          exception.push("app_version");
          LocalStorageProvider.removeLocalStorageItemExcept(exception);
          SALESFORCE_CONFIG.accessToken = '';
          $rootScope.isLogged = false;
        } catch (err) {
          $log.error("err: ", err);
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
        }
      };

      pub.changePasswordNoAuth = function(rut, pass, newPass, code) {
        var defer = $q.defer();
        var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_EXTERNAL_CHANGE_PASS;
        var data = {
          bean: {
            'rut': rut,
            'newPassword': pass,
            'verifyNewPassword': newPass,
            'code': code.toString()
          }

        };
        var params = {};
        var headers = {
          'Content-type': 'application/json'
        };
        ConnectionProvider.sendPost(url, params, data, headers, function(respuesta) {
          $log.debug('Get User Session: ', respuesta);
          if (respuesta.code.toString() == "200") {
            defer.resolve(respuesta);
          } else {
            $log.error('Error changePasswordNoAuth: ', respuesta.message);
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
          $log.error('Error changePasswordNoAuth: ' + err);
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

      pub.requestPasswordChangeCode = function(rut) {
        var defer = $q.defer();
        var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_EXTERNAL_CODE_REQUEST;
        var params = {
          'rut': rut
        };
        var data = {};
        var headers = {
          'Content-type': 'application/json'
        };
        ConnectionProvider.sendGet(url, params, data, headers, function(respuesta) {
          $log.debug('Get User Session: ', respuesta);
          if (respuesta.code.toString() == "200") {
            defer.resolve(respuesta.data);
          } else {
            $log.error('Error requestPasswordChangeCode: ', respuesta.message);
            var obj = {};
            obj.code = respuesta.code;
            obj.message = respuesta.message;
            if (respuesta.analyticsCode) {
              obj.analyticsCode = respuesta.analyticsCode
            } else {
              obj.analyticsCode = "ERR999";
            }
            defer.reject(obj);
          }

        }, function(err) {
          $log.error('Error requestPasswordChangeCode: ', err);
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
        })
        return defer.promise;
      };


      pub.registerUser = function(userData) {
        var defer = $q.defer();
        var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_EXTERNAL_REGISTRY_USER;
        var data = {
          bean: userData

        };
        var params = {};
        var headers = {
          'Content-type': 'application/json'
        };
        ConnectionProvider.sendPost(url, params, data, headers, function(respuesta) {
          $log.debug('Get User Session: ', respuesta);
          if (respuesta.code.toString() == "200") {
            defer.resolve(respuesta.data);
          } else {
            $log.error('Error registerUser: ', respuesta.message);
            var obj = {};
            obj.code = respuesta.code;
            obj.message = respuesta.message;
            if (respuesta.analyticsCode) {
              obj.analyticsCode = respuesta.analyticsCode
            } else {
              obj.analyticsCode = "ERR999";
            }
            defer.reject(obj);
          }

        }, function(err) {
          $log.error('Error changePasswordNoAuth: ' + err);
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

      pub.validateUser = function(userId, code) {
        var defer = $q.defer();
        var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_EXTERNAL_ACTIVATE_ACCOUNT;
        var data = {
          bean: {
            "verificationCode": code.toString(),
            "userId": userId
          }
        };
        var params = {};
        var headers = {
          'Content-type': 'application/json'
        };
        ConnectionProvider.sendPost(url, params, data, headers, function(respuesta) {
          $log.debug('Get User Session: ', respuesta);
          if (respuesta.code.toString() == "200") {
            defer.resolve(respuesta.data);
          } else {
            $log.error('Error registerUser: ', respuesta.message);
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
          $log.error('Error changePasswordNoAuth: ' + err);
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