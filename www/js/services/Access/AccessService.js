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
          $log.info('Get CommercialData: ', respuesta);
          if (respuesta.code.toString() == "200") {
            var items = [];
            if (respuesta.data != null && respuesta.data.length > 0) {
              angular.forEach(respuesta.data, function(value, key) {
                $log.info(key + ' : ', value);
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
                data.consumo = value.consumo;
                data.codigoBarra = value.codigoBarra;
                items.push(data);
              });
            }
            defer.resolve(items);
          } else {
            $log.error('Error CommercialData: ' + respuesta.message);
            var obj = {};
            obj.code = respuesta.code;
            obj.message = respuesta.message;
            defer.reject(obj);
          }
        }, function(err) {
          $log.error('Error CommercialData: ' + err);
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
          $log.info('Get CommercialData: ', respuesta);
          if (respuesta.code.toString() == "200") {
            var obj = {};
            //VERSION ANTIGUA
            //   obj.numeroSuministro = respuesta.data.numeroSuministro;
            //   obj.nombreSuministro = respuesta.data.nombreSuministro;
            //   obj.montoUltimaBoleta = respuesta.data.montoUltimaBoleta;
            //   obj.montoDeudaAnterior = respuesta.data.montoDeudaAnterior;
            //   obj.idSuministro = respuesta.data.idSuministro;
            //   obj.estadoSuministro = respuesta.data.estadoSuministro;
            //   obj.direccion = respuesta.data.direccion.calle + " " + respuesta.data.direccion.casa + " " + respuesta.data.direccion.departamento + " " + respuesta.data.direccion.comuna;
            //   obj.digitoVerificador = respuesta.data.digitoVerificador;

            //VERSION NUEVA
            obj.codigoBarra = respuesta.data.codigoBarra;
            obj.consumo = respuesta.data.consumo;
            obj.digitoVerificador = respuesta.data.digitoVerificador;
            obj.direccion = respuesta.data.direccion.calle + " " + respuesta.data.direccion.casa + " " + respuesta.data.direccion.departamento + " " + respuesta.data.direccion.comuna;
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
            $log.info("obj: ", obj);
            defer.resolve(obj);
          } else {
            $log.error('Error CommercialData: ' + respuesta.message);
            var obj = {};
            obj.code = respuesta.code;
            obj.message = respuesta.message;
            defer.reject(obj);
          }
        }, function(err) {
          $log.error('Error CommercialData: ' + err);
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
        })
        return defer.promise;
      }





      //PRIVATE SERVICES
      //LOGIN CON VISUAL FORCE PAGE
      // pub.getLoginAccess = function(isMovilDevice) {
      //   var defer = $q.defer();
      //   if (isMovilDevice) {
      //     var loginWindowURL = SALESFORCE_CONFIG.loginURL + '/services/oauth2/authorize?client_id=' + SALESFORCE_CONFIG.appId + '&redirect_uri=' +
      //       SALESFORCE_CONFIG.oauthCallbackURL + '&response_type=token&prompt=login';
      //     var ref = window.open(loginWindowURL, '_blank', 'location=no');
      //     ref.addEventListener('loadstart', function(event) {
      //       if (typeof String.prototype.startsWith != 'function') {
      //         String.prototype.startsWith = function(str) {
      //           return this.indexOf(str) === 0;
      //         };
      //       }
      //       if ((event.url).startsWith(SALESFORCE_CONFIG.oauthCallbackURL)) {
      //         $log.info('oauth callback url');
      //         event.url = decodeURIComponent(event.url);
      //         var query = event.url.substr(event.url.indexOf('#') + 1);
      //         var data = {};
      //         var parts = query.split('&');
      //         // read names and values
      //         for (var i = 0; i < parts.length; i++) {
      //           var name = parts[i].substr(0, parts[i].indexOf('='));
      //           var val = parts[i].substr(parts[i].indexOf('=') + 1);
      //           val = decodeURIComponent(val);
      //           data[name] = val;
      //         }
      //         LocalStorageProvider.setLocalStorageItem("access_token", data.access_token);
      //         LocalStorageProvider.setLocalStorageItem("refresh_token", data.refresh_token);
      //         SALESFORCE_CONFIG.accessToken = data.access_token;
      //         SALESFORCE_CONFIG.refreshToken = data.refresh_token;
      //         LocalStorageProvider.setLocalStorageItem("SALESFORCE_CONFIG", SALESFORCE_CONFIG);
      //         defer.resolve(SALESFORCE_CONFIG);
      //         ref.close();
      //       }
      //     });
      //   } else {
      //     force.login(function(response) {
      //       var callbackResponse = LocalStorageProvider.getLocalStorageItem('user_data').split("#")[1];
      //       callbackResponse = decodeURIComponent(callbackResponse);
      //       var responseParameters = (callbackResponse).split("&");
      //       var parameterMap = [];
      //       for (var i = 0; i < 2; i++) {
      //         parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
      //       }
      //       if (parameterMap.access_token !== undefined && parameterMap.access_token !== null && parameterMap.refresh_token !== undefined && parameterMap.refresh_token !== null) {
      //         LocalStorageProvider.setLocalStorageItem("access_token", parameterMap.access_token);
      //         LocalStorageProvider.setLocalStorageItem("refresh_token", parameterMap.refresh_token);
      //         SALESFORCE_CONFIG.accessToken = parameterMap.access_token;
      //         SALESFORCE_CONFIG.refreshToken = parameterMap.refresh_token;
      //         LocalStorageProvider.setLocalStorageItem("SALESFORCE_CONFIG", SALESFORCE_CONFIG);
      //         defer.resolve(SALESFORCE_CONFIG);
      //       } else {
      //         defer.reject("No access and refresh token");
      //       }
      //     }, function(err) {
      //       $log.error('Error LoginAccess: ' + err);
      //       var obj = {};
      //       if (err[0]) {
      //         obj.code = err[0].errorCode;
      //         obj.message = err[0].message;
      //       } else if (err.code) {
      //         obj.code = err.code;
      //         obj.message = err.message;
      //       } else if (err.data) {
      //         obj.code = err.data.status;
      //         obj.message = err.data.msg;
      //       } else {
      //         obj.code = "400";
      //         obj.message = err;
      //       }
      //       defer.reject(obj);
      //     });
      //   }
      //   return defer.promise;
      // };


      //LOGIN CON SERVICIO
      pub.getLoginServices = function(userNumber, password) {
        var defer = $q.defer();
        var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_GET_USER_SESSION;
        var params = {};
        var data = {
          bean: {
            rut: userNumber,
            password: password
          }
        };
        var headers = {
          'Content-type': 'application/json'
        };
        ConnectionProvider.sendPost(url, params, data, headers, function(respuesta) {
          $log.info('Get User Session: ', respuesta);
          if (respuesta.code.toString() == "200") {
            var obj = {};
            var loginData = {};
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
            loginData.userNumber = userNumber;
            loginData.password = password;
            LocalStorageProvider.setLocalStorageItem("access_token", obj.sessionId);
            // LocalStorageProvider.setLocalStorageItem("contact_id", obj.contactId);
            LocalStorageProvider.setLocalStorageItem("user_data", obj);
            LocalStorageProvider.setLocalStorageItem("login_data", loginData);
            SALESFORCE_CONFIG.accessToken = obj.sessionId;
            SALESFORCE_CONFIG.loginURL = ENDPOINTS.ENDPOINTS_SALESFORCE;
            SALESFORCE_CONFIG.proxyURL = ENDPOINTS.ENDPOINTS_SALESFORCE;
            LocalStorageProvider.setLocalStorageItem("SALESFORCE_CONFIG", SALESFORCE_CONFIG);
            obj.SALESFORCE_CONFIG = SALESFORCE_CONFIG;
            force.init(SALESFORCE_CONFIG);
            // $log.info("obj: ", SALESFORCE_CONFIG);
            defer.resolve(obj);
          } else {
            $log.error('Error CommercialData: ' + respuesta.message);
            var obj = {};
            obj.code = respuesta.code;
            obj.message = respuesta.message;
            defer.reject(obj);
          }

        }, function(err) {
          $log.error('Error CommercialData: ' + err);
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
        })
        return defer.promise;
      };

      // pub.getContactId = function() {
      //   var defer = $q.defer();
      //   if (LocalStorageProvider.getLocalStorageItem('contact_id')) {
      //     defer.resolve(LocalStorageProvider.getLocalStorageItem('contact_id'));
      //   } else {
      //     var obj = {};
      //     obj.path = ENDPOINTS.ENDPOINTS_GET_CONTACT_ID;
      //     obj.method = 'GET';
      //     obj.contentType = 'application/json';
      //     obj.params = null;
      //     obj.data = '';

      //     SalesforceProvider.request(obj).then(function(respuesta) {
      //       if (respuesta.code.toString() == "200") {
      //         $log.info("getContactId ", respuesta.data);
      //         LocalStorageProvider.setLocalStorageItem('contact_id', respuesta.data.idContact);
      //         defer.resolve(respuesta.data.idContact);
      //       } else {
      //         $log.error('Error AssetList: ', respuesta.message);
      //         var obj = {};
      //         obj.code = respuesta.code;
      //         obj.message = respuesta.message;
      //         defer.reject(obj);
      //       }

      //     }, function(err) {
      //       $log.error('Error AssetList: ', err);
      //       var obj = {};
      //       if (err[0]) {
      //         obj.code = err[0].errorCode;
      //         obj.message = err[0].message;
      //       } else if (err.code) {
      //         obj.code = err.code;
      //         obj.message = err.message;
      //       } else if (err.data) {
      //         obj.code = err.data.status;
      //         obj.message = err.data.msg;
      //       } else {
      //         obj.code = "400";
      //         obj.message = err;
      //       }
      //       defer.reject(obj);
      //     });
      //   }
      //   return defer.promise;
      // };


      pub.getLogout = function() {
        try {
          force.discardToken();
          var exception = [];
          exception.push("Object_branches");
          exception.push("no_session_client_number");
          exception.push("passTuto");
          LocalStorageProvider.removeLocalStorageItemExcept(exception);
          SALESFORCE_CONFIG.accessToken = '';
          // SALESFORCE_CONFIG.refreshToken = '';
          $rootScope.isLogged = false;
        } catch (err) {
          $log.error("err: ", err);
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
          $log.info('Get User Session: ', respuesta);
          if (respuesta.code.toString() == "200") {
            defer.resolve(respuesta);
          } else {
            $log.error('Error changePasswordNoAuth: ', respuesta.message);
            var obj = {};
            obj.code = respuesta.code;
            obj.message = respuesta.message;
            defer.reject(obj);
          }

        }, function(err) {
          $log.error('Error changePasswordNoAuth: ' + err);
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
          $log.info('Get User Session: ', respuesta);
          if (respuesta.code.toString() == "200") {
            defer.resolve(respuesta.data);
          } else {
            $log.error('Error requestPasswordChangeCode: ', respuesta.message);
            var obj = {};
            obj.code = respuesta.code;
            obj.message = respuesta.message;
            defer.reject(obj);
          }

        }, function(err) {
          $log.error('Error requestPasswordChangeCode: ', err);
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
          $log.info('Get User Session: ', respuesta);
          if (respuesta.code.toString() == "200") {
            defer.resolve(respuesta.data);
          } else {
            $log.error('Error registerUser: ', respuesta.message);
            var obj = {};
            obj.code = respuesta.code;
            obj.message = respuesta.message;
            defer.reject(obj);
          }

        }, function(err) {
          $log.error('Error changePasswordNoAuth: ' + err);
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
          $log.info('Get User Session: ', respuesta);
          if (respuesta.code.toString() == "200") {
            defer.resolve(respuesta.data);
          } else {
            $log.error('Error registerUser: ', respuesta.message);
            var obj = {};
            obj.code = respuesta.code;
            obj.message = respuesta.message;
            defer.reject(obj);
          }

        }, function(err) {
          $log.error('Error changePasswordNoAuth: ' + err);
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