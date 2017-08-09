/**
 * Created by ngajardo on 12-12-2016.
 */
angular.module('UsageModule').factory('UsageService', function($q, ConnectionProvider, SalesforceProvider, LocalStorageProvider, $log, ENDPOINTS, AccessService) {

  pub = {};
  //PRIVATE SERVICES
  pub.getAssetList = function() {
    // var defer = $q.defer();
    // if (LocalStorageProvider.getLocalStorageItem('asset_list')) {
    //     defer.resolve(LocalStorageProvider.getLocalStorageItem('asset_list'));
    // } else {
    //     var obj = {};
    //     obj.path = ENDPOINTS.ENDPOINTS_ASSESTS_LIST;
    //     obj.method = 'GET';
    //     obj.contentType = 'application/json';
    //     obj.params = {};
    //     obj.data = '';

    //     SalesforceProvider.request(obj).then(function(respuesta) {
    //         if (respuesta.code.toString() == "200") {
    //             $log.info("getAssetList ", respuesta.data);
    //             var items = [];
    //             if (respuesta.data != null && respuesta.data.length > 0) {
    //                 angular.forEach(respuesta.data, function(value, key) {
    //                     $log.info(key + ' : ', value);
    //                     var data = {};
    //                     data.index = key;
    //                     data.direccion = value.direccion.direccion + " " + value.direccion.comuna;
    //                     data.numeroSuministro = value.numeroSuministro;
    //                     items.push(data);
    //                 });
    //             }
    //             LocalStorageProvider.setLocalStorageItem('asset_list', items);
    //             defer.resolve(items);
    //         } else {
    //             $log.error('Error AssetList: ', respuesta.message);
    //             var obj = {};
    //             obj.code = respuesta.code;
    //             obj.message = respuesta.message;
    //             defer.reject(obj);
    //         }
    //     }, function(err) {
    //         if (err.errorCode && err.errorCode == "INVALID_SESSION_ID") {
    //             if (LocalStorageProvider.getLocalStorageItem("login_data")) {
    //                 var loginData = LocalStorageProvider.getLocalStorageItem("login_data");
    //                 var userNumber = loginData.userNumber;
    //                 var password = loginData.password;
    //                 AccessService.getLoginServices(userNumber, password).then(
    //                     function(response) {
    //                         pub.getAssetList(contactId);
    //                     },
    //                     function(error) {
    //                         $log.error('Error AssetList: ', error);

    //                         defer.reject(error);
    //                     });
    //             }
    //         } else {
    //             $log.error('Error AssetList: ', err);
    //             var obj = {};
    //             if (err[0]) {
    //                 obj.code = err[0].errorCode;
    //                 obj.message = err[0].message;
    //             } else if (err.code) {
    //                 obj.code = err.code;
    //                 obj.message = err.message;
    //             } else if (err.data) {
    //                 obj.code = err.data.status;
    //                 obj.message = err.data.msg;
    //             } else {
    //                 obj.code = "400";
    //                 obj.message = err;
    //             }
    //             defer.reject(obj);
    //         }
    //     });
    // }
    // return defer.promise;



    var defer = $q.defer();
    if (LocalStorageProvider.getLocalStorageItem('asset_list')) {
      defer.resolve(LocalStorageProvider.getLocalStorageItem('asset_list'));
    } else {
      var obj = {};
      obj.path = ENDPOINTS.ENDPOINTS_ASSESTS_LIST;
      obj.method = 'GET';
      obj.contentType = 'application/json';
      obj.params = {};
      obj.data = '';

      SalesforceProvider.request(obj).then(function(respuesta) {
        if (respuesta.code.toString() == "200") {
          $log.info("getAssetList ", respuesta.data);
          var items = [];
          if (respuesta.data != null && respuesta.data.length > 0) {
            angular.forEach(respuesta.data, function(value, key) {
              $log.info(key + ' : ', value);
              var data = {};
              data.index = key;
              data.direccion = value.direccion.direccion + " " + value.direccion.comuna;
              data.numeroSuministro = value.numeroSuministro;
              data.numeroSuministroDv = value.numeroSuministro + "-" + value.digitoVerificador;
              items.push(data);
            });
          }
          LocalStorageProvider.setLocalStorageItem('asset_list', items);
          defer.resolve(items);
        } else {
          $log.error('Error AssetList: ', respuesta.message);
          var obj = {};
          obj.code = respuesta.code;
          obj.message = respuesta.message;
          defer.reject(obj);
        }
      }, function(err) {
        $log.error('Error AssetList: ', err);
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
  };


  pub.getAssetDebt = function(assetId, index) {
    var defer = $q.defer();
    if (LocalStorageProvider.getLocalStorageItem('asset_debt_' + index)) {
      defer.resolve(LocalStorageProvider.getLocalStorageItem('asset_debt_' + index));
    } else {
      var obj = {};
      obj.path = ENDPOINTS.ENDPOINTS_ASSET_DEBT;
      obj.method = 'GET';
      obj.contentType = 'application/json';
      obj.params = {
        numeroSuministro: assetId
      };
      obj.data = '';

      SalesforceProvider.request(obj).then(function(respuesta) {
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
          LocalStorageProvider.setLocalStorageItem('asset_debt_' + index, items);
          defer.resolve(items);
        } else {
          $log.error('Error AssetDebt: ', respuesta.message);
          var error = {};
          error.code = respuesta.code;
          error.message = respuesta.message;
          defer.reject(error);
        }

      }, function(err) {
        $log.error('Error AssetList: ', err);
        var error = {};
        if (err[0]) {
          error.code = err[0].errorCode;
          error.message = err[0].message;
        } else if (err.code) {
          error.code = err.code;
          error.message = err.message;
        } else if (err.data) {
          error.code = err.data.status;
          error.message = err.data.msg;
        } else {
          error.code = "400";
          error.message = err;
        }
        defer.reject(error);

      });
    }
    return defer.promise;
  }



  pub.getAssetDetail = function(assetId, index, assetNumberDv, assetAddress) {
    var defer = $q.defer();
    if (LocalStorageProvider.getLocalStorageItem('asset_detail_' + index)) {
      defer.resolve(LocalStorageProvider.getLocalStorageItem('asset_detail_' + index));
    } else {
      var obj = {};
      obj.path = ENDPOINTS.ENDPOINTS_ASSET_DETAIL;
      obj.method = 'GET';
      obj.contentType = 'application/json';
      obj.params = {
        numeroSuministro: assetId
      };
      obj.data = '';

      SalesforceProvider.request(obj).then(function(respuesta) {
        if (respuesta.code.toString() == "200") {
          var data = {};
          if (respuesta.data != null && respuesta.data != '') {
            data.tarifa = respuesta.data.tarifa;
            // data.numeroSuministro = respuesta.data.numeroSuministro;
            // data.nombreSuministro = respuesta.data.nombreSuministro;
            data.montoUltimoPago = respuesta.data.montoUltimoPago;
            // data.montoUltimaBoleta = respuesta.data.montoUltimaBoleta;
            // data.montoDeudaAnterior = respuesta.data.montoDeudaAnterior;
            // data.idSuministro = respuesta.data.idSuministro;
            // data.fechaVencimiento = respuesta.data.fechaVencimiento;
            data.fechaUltimoPago = respuesta.data.fechaUltimoPago;
            data.fechaProximaLectura = respuesta.data.fechaProximaLectura;
            data.fechaCorte = respuesta.data.fechaCorte;
            data.billingPeriod = respuesta.data.billingPeriod;
            data.numeroSuministro = assetId;
            data.numeroSuministroDv = assetNumberDv;
            data.direccion = assetAddress;
            // data.estadoSuministro = respuesta.data.estadoSuministro;
            // data.direccion = respuesta.data.direccion.calle + " " + respuesta.data.direccion.casa + " " + respuesta.data.direccion.departamento + " " + respuesta.data.direccion.comuna;
          }
          LocalStorageProvider.setLocalStorageItem('asset_detail_' + index, data);
          defer.resolve(data);
        } else {
          $log.error('Error AssetDetail: ', respuesta.message);
          var obj = {};
          obj.code = respuesta.code;
          obj.message = respuesta.message;
          defer.reject(obj);
        }

      }, function(err) {
        $log.error('Error AssetList: ', err);
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





  pub.getAssetUsage = function(assetId, index) {
    var defer = $q.defer();
    if (LocalStorageProvider.getLocalStorageItem('asset_usages_' + index)) {
      defer.resolve(LocalStorageProvider.getLocalStorageItem('asset_usages_' + index));
    } else {
      var obj = {};
      obj.path = ENDPOINTS.ENDPOINTS_CONSUMPTION;
      obj.method = 'GET';
      obj.contentType = 'application/json';
      obj.params = {
        numeroSuministro: assetId
      };
      obj.data = '';

      SalesforceProvider.request(obj).then(function(respuesta) {
        if (respuesta.code.toString() == "200") {
          $log.info("getAssetUsage ", respuesta.data);
          var response = {};
          var items = [];
          var graphlabels = [];
          var graphdata = [];
          if (respuesta.data != null && respuesta.data.length > 0) {
            angular.forEach(respuesta.data, function(value, key) {
              $log.info(key + ' : ', value);
              var data = {};
              data.index = key;
              data.numeroCuenta = value.numeroCuenta;
              data.nombrePuntoDistribucion = value.nombrePuntoDistribucion;
              data.nombreConsumo = value.nombreConsumo;
              data.idPuntoDistribucion = value.idPuntoDistribucion;
              data.idConsumidor = value.idConsumidor;
              data.fechaLectura = value.fechaLectura;
              data.fechaFacturacion = value.fechaFacturacion;
              data.consumoEnergia = value.consumoEnergia;
              items.push(data);
              graphlabels.push(data.fechaLectura);
              graphdata.push(data.consumoEnergia);
            });
          }
          response.items = items;
          response.graphlabels = graphlabels.reverse();
          response.graphdata = graphdata.reverse();
          var options = {
            scales: {
              xAxes: [{
                display: false
              }]
            }
          }
          response.options = options;
          LocalStorageProvider.setLocalStorageItem('asset_usages_' + index, items);
          defer.resolve(items);
        } else {
          $log.error('Error AssetUsage: ', respuesta.message);
          var obj = {};
          obj.code = respuesta.code;
          obj.message = respuesta.message;
          defer.reject(obj);
        }

      }, function(err) {
        $log.error('Error AssetUsage: ', err);
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

  pub.getAssetBills = function(assetId, index) {
    var defer = $q.defer();
    if (LocalStorageProvider.getLocalStorageItem('asset_bills_' + index)) {
      defer.resolve(LocalStorageProvider.getLocalStorageItem('asset_bills_' + index));
    } else {
      var obj = {};
      obj.path = ENDPOINTS.ENDPOINTS_GET_BILLS;
      obj.method = 'GET';
      obj.contentType = 'application/json';
      obj.params = {
        numeroSuministro: assetId
      };
      obj.data = '';

      SalesforceProvider.request(obj).then(function(respuesta) {
        if (respuesta.code.toString() == "200") {
          $log.info("getAssetBills ", respuesta.data);
          var response = {};
          var items = [];
          var graphlabels = [];
          var graphdata = [];
          if (respuesta.data != null && respuesta.data.length > 0) {
            angular.forEach(respuesta.data, function(value, key) {
              $log.info(key + ' : ', value);
              var data = {};
              data.index = key;
              data.monto = value.monto;
              data.fecha = value.fecha;
              items.push(data);
              graphlabels.push(data.fecha);
              graphdata.push(data.monto);
            });
          }
          response.items = items;
          response.graphlabels = graphlabels.reverse();
          response.graphdata = graphdata.reverse();
          var options = {
            scales: {
              xAxes: [{
                display: false
              }]
            }
          }
          response.options = options;
          LocalStorageProvider.setLocalStorageItem('asset_bills_' + index, response);
          defer.resolve(response);
        } else {
          $log.error('Error AssetBills: ', respuesta.message);
          var obj = {};
          obj.code = respuesta.code;
          obj.message = respuesta.message;
          defer.reject(obj);
        }
      }, function(err) {
        $log.error('Error AssetBills: ', err);
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

  pub.getAssetPayments = function(assetId, index) {
    var defer = $q.defer();
    if (LocalStorageProvider.getLocalStorageItem('asset_payments_' + index)) {
      defer.resolve(LocalStorageProvider.getLocalStorageItem('asset_payments_' + index));
    } else {
      var obj = {};
      obj.path = ENDPOINTS.ENDPOINTS_GET_PAYMENTS;
      obj.method = 'GET';
      obj.contentType = 'application/json';
      obj.params = {
        numeroSuministro: assetId
      };
      obj.data = '';

      SalesforceProvider.request(obj).then(function(respuesta) {
        if (respuesta.code.toString() == "200") {
          $log.info("getAssetBills ", respuesta.data);
          var response = {};
          var items = [];
          var graphlabels = [];
          var graphdata = [];
          var datasets = [];
          if (respuesta.data != null && respuesta.data.length > 0) {
            angular.forEach(respuesta.data, function(value, key) {
              $log.info(key + ' : ', value);
              var data = {};
              data.index = key;
              data.tipoPago = value.tipoPago;
              data.monto = value.monto;
              data.fechaPago = value.fechaPago;
              var colorGraph = {
                backgroundColor: [
                  'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                  'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
              };
              items.push(data);
              graphlabels.push(data.fechaPago);
              graphdata.push(data.monto);
              datasets.push(colorGraph);
            });
          }
          response.items = items;
          response.graphlabels = graphlabels.reverse();
          response.graphdata = graphdata.reverse();
          response.datasets = datasets.reverse();
          var options = {
            scales: {
              xAxes: [{
                display: false
              }]
            }
          }
          response.options = options;
          LocalStorageProvider.setLocalStorageItem('asset_payments_' + index, response);
          defer.resolve(response);
        } else {
          $log.error('Error AssetPayments: ', respuesta.message);
          var obj = {};
          obj.code = respuesta.code;
          obj.message = respuesta.message;
          defer.reject(obj);
        }
      }, function(err) {
        $log.error('Error AssetPayments: ', err);
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

  pub.setEnterReading = function(assetId, reading, readingDay, readingNight, readingPeak) {
    var defer = $q.defer();
    var obj = {};
    obj.path = ENDPOINTS.ENDPOINTS_ENTER_READING;
    obj.method = 'GET';
    obj.contentType = 'application/json';
    if ((reading != null && reading != '') && (readingDay == null || readingDay == '' || readingNight == null || readingNight == '' || readingPeak == null || readingPeak == '')) {
      obj.params = {
        numeroSuministro: assetId,
        lectura: reading
      };

      //'numeroSuministro=' + assetId + "&lectura" + reading;
    } else if ((reading == null || reading == '') && (readingDay != null && readingDay != '' && readingNight != null && readingNight != '' && readingPeak != null && readingPeak != '')) {
      obj.params = {
        numeroSuministro: assetId,
        lecturaDia: readingDay,
        lecturaNoche: readingNight,
        lecturaPunta: readingPeak
      };
      //'numeroSuministro=' + assetId + "&lecturaDia" + readingDay + "&lecturaNoche" + readingNight + "&lecturaPunta" + readingPeak;
    } else {
      obj.params = {
        numeroSuministro: assetId
        //'numeroSuministro=' + assetId
      };
    }
    obj.data = '';

    SalesforceProvider.request(obj).then(function(respuesta) {
      if (respuesta.code.toString() == "200") {
        $log.info("setEnterReading ", respuesta.data);
        var data = {};
        if (respuesta.data != null && respuesta.data.length > 0) {
          data.caseId = respuesta.data.caseId;
        }
        defer.resolve(data);
      } else {
        $log.error('Error AssetDetail: ', respuesta.message);
        var obj = {};
        obj.code = respuesta.code;
        obj.message = respuesta.message;
        defer.reject(obj);
      }

    }, function(err) {
      $log.error('Error AssetDetail: ', err);
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
  }

  pub.removeUsageData = function() {
    try {
      var exception = [];
      exception.push("SALESFORCE_CONFIG");
      exception.push("branches");
      exception.push("contact_id");
      exception.push("login_url");
      exception.push("no_session_client_number");
      LocalStorageProvider.removeLocalStorageItemExcept(exception);
    } catch (err) {
      $log.error("err: ", err);
    }
  };

  return pub;
});