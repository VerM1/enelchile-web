/**
 * Created by ngajardo on 12-12-2016.
 */
angular.module('UsageModule').factory('UsageService', function($q, ConnectionProvider, SalesforceProvider, LocalStorageProvider, $log, ENDPOINTS, AccessService, UTILS_CONFIG) {

  pub = {};
  //PRIVATE SERVICES
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

            //PARA HACER PRUEBAS CON SLIDER/BULLETS Y MUCHOS SUMINISTROS
            // for (var i = 0; i < 50; i++) {
            //   var data = {};
            //   data.index = i;
            //   data.direccion = "direccion " + i;

            //   data.comuna = "comuna " + i;
            //   data.numeroSuministro = i;
            //   data.numeroSuministroDv = i + "-" + i;
            //   items.push(data);
            // }

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
                if (value.comuna && value.comuna != null && value.comuna != "") {
                  data.direccion = data.direccion + " " + value.comuna;
                  data.comuna = value.comuna;
                }
                data.consumo = value.consumo;
                data.codigoBarra = value.codigoBarra;
                items.push(data);
              } else {
                $log.debug("el elemento ya fue pagado, no se incluira en la lista");
              }
            });
          }
          if (items.length > 0) {
            LocalStorageProvider.setLocalStorageItem('asset_debt_' + index, items);
          }
          defer.resolve(items);
        } else {
          $log.error('Error AssetDebt: ', respuesta.message);
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
            data.montoUltimoPago = respuesta.data.montoUltimoPago;
            data.fechaUltimoPago = respuesta.data.fechaUltimoPago;
            data.fechaProximaLectura = respuesta.data.fechaProximaLectura;
            data.fechaCorte = respuesta.data.fechaCorte;
            data.billingPeriod = respuesta.data.billingPeriod;
            data.numeroSuministro = assetId;
            data.numeroSuministroDv = assetNumberDv;
            data.direccion = assetAddress;
          }
          LocalStorageProvider.setLocalStorageItem('asset_detail_' + index, data);
          defer.resolve(data);
        } else {
          $log.error('Error AssetDetail: ', respuesta.message);
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
          $log.debug("getAssetUsage ", respuesta.data);
          var response = {};
          var items = [];
          var graphlabels = [];
          var graphdata = [];
          var graphdataset = [];
          var options = {};
          var pointBackgroundColor = [];
          var borderColor = [];
          //
          var dataGraphReading = [];
          var dataGraphReadingDay = [];
          var dataGraphReadingNight = [];
          var dataGraphReadingPeak = [];

          var montoAux = 0;
          var mesAux = 0;
          var fechaAux = "";
          //
          if (respuesta.data != null && respuesta.data.length > 0) {
            for (var i = 0; i < respuesta.data.length; i++) {
              $log.debug(i + ' : ', respuesta.data[i]);
              var data = {};
              var actualReading = "";
              var ammountGraph = "";
              data.index = i;
              var value = respuesta.data[i];
              data.fechaFacturacion = value.fecha;
              if (value.totalConsumo != null && value.totalConsumo.toString() != "" && value.totalConsumo.toString() != "0" && value.totalConsumo.toString() != "-") {
                data.lecturaActual = value.totalConsumo;
                actualReading = value.totalConsumo;
              } else {
                data.lecturaActual = "-";
                actualReading = "0";
              }
              if (value.consumoMes != null && value.consumoMes.toString() != "" && value.consumoMes.toString() != "0" && value.consumoMes.toString() != "-") {
                data.consumoEnergia = value.consumoMes;
                ammountGraph = value.consumoMes;
              } else {
                data.consumoEnergia = "-";
                ammountGraph = "0";
              }
              if (value.tipoConsumo && value.tipoConsumo != null && value.tipoConsumo.toString() != "" && value.tipoConsumo.toString() != "0" && value.tipoConsumo.toString() != "-") {
                data.tipoConsumo = value.tipoConsumo;
              } else {
                data.tipoConsumo = "-";
              }
              items.push(data);
              //
              if (data.tipoConsumo === UTILS_CONFIG.USAGE_TYPE_RATE_TYPE_CODE_3) {
                dataGraphReadingDay.push(ammountGraph);
              } else if (data.tipoConsumo === UTILS_CONFIG.USAGE_TYPE_RATE_TYPE_CODE_4) {
                dataGraphReadingNight.push(ammountGraph);
              } else if (data.tipoConsumo === UTILS_CONFIG.USAGE_TYPE_RATE_TYPE_CODE_5) {
                dataGraphReadingPeak.push(ammountGraph);
              } else {
                dataGraphReading.push(ammountGraph);
              }
              //
              //

              if (data.tipoConsumo === UTILS_CONFIG.USAGE_TYPE_RATE_TYPE_CODE_3 || data.tipoConsumo === UTILS_CONFIG.USAGE_TYPE_RATE_TYPE_CODE_4 || data.tipoConsumo === UTILS_CONFIG.USAGE_TYPE_RATE_TYPE_CODE_5) {
                var fechaSplit = value.fecha.split("/");
                var mesSplit = fechaSplit[1];
                if (mesAux == mesSplit) {
                  if ((i + 1) === respuesta.data.length) {
                    graphlabels.push(value.fecha);
                  }
                } else if (mesAux != mesSplit && i != 0) {
                  graphlabels.push(respuesta.data[i - 1].fecha);
                  mesAux = mesSplit;
                  fechaAux = value.fecha;
                  if ((i + 1) === respuesta.data.length) {
                    graphlabels.push(value.fecha);
                  }
                } else {
                  mesAux = mesSplit;
                  fechaAux = value.fecha;
                }
              } else {
                graphlabels.push(value.fecha);
              }
            }
          }
          //

          //
          response.items = items;
          response.typeUsage = "";
          if (response.items.length > 0 && response.items[0].tipoConsumo === UTILS_CONFIG.USAGE_TYPE_RATE_TYPE_CODE_1) {
            response.typeUsage = UTILS_CONFIG.USAGE_TYPE_RATE_TYPE_CODE_1;
            graphdata.push(dataGraphReading.reverse());
          } else {
            graphdata.push(dataGraphReadingDay.reverse());
            graphdata.push(dataGraphReadingNight.reverse());
            graphdata.push(dataGraphReadingPeak.reverse());
          }
          response.graphdata = graphdata;
          response.graphlabels = graphlabels.reverse();
          // options.responsive = false;
          // options.maintainAspectRatio = false;
          response.options = options;
          LocalStorageProvider.setLocalStorageItem('asset_usages_' + index, response);
          defer.resolve(response);
        } else {
          $log.error('Error AssetUsage: ', respuesta.message);
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
        $log.error('Error AssetUsage: ', err);
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
          $log.debug("getAssetBills ", respuesta.data);
          var response = {};
          var items = [];
          var graphlabels = [];
          var graphdata = [];
          var graphdataarray = [];
          var options = {};
          if (respuesta.data != null && respuesta.data.length > 0) {
            angular.forEach(respuesta.data, function(value, key) {
              $log.debug(key + ' : ', value);
              var data = {};
              data.index = key;
              var ammountGraph = "";
              if (value.monto != null && value.monto.toString() != "" && value.monto.toString() != "0" && value.monto.toString() != "-") {
                data.monto = value.monto;
                ammountGraph = value.monto;
              } else {
                data.monto = "-";
                ammountGraph = "0";
              }
              data.fecha = value.fecha;
              if (value.boleta && value.boleta != null && value.boleta.toString() != "") {
                data.boleta = value.boleta;
              } else {
                data.boleta = 0;
              }
              items.push(data);
              graphlabels.push(data.fecha);
              graphdataarray.push(ammountGraph);
            });
          }
          response.items = items;
          response.graphlabels = graphlabels.reverse();
          graphdata.push(graphdataarray.reverse());
          response.graphdata = graphdata;
          // options.responsive = false;
          // options.maintainAspectRatio = false;
          response.options = options;
          LocalStorageProvider.setLocalStorageItem('asset_bills_' + index, response);
          defer.resolve(response);
        } else {
          $log.error('Error AssetBills: ', respuesta.message);
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
        $log.error('Error AssetBills: ', err);
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
          $log.debug("getAssetBills ", respuesta.data);
          var response = {};
          var items = [];
          var graphlabels = [];
          var graphdata = [];
          var graphdataarray = [];
          var options = {};
          if (respuesta.data != null && respuesta.data.length > 0) {
            angular.forEach(respuesta.data, function(value, key) {
              $log.debug(key + ' : ', value);
              var data = {};
              data.index = key;
              if (value.tipoPago != null && value.tipoPago.toString() != "" && value.tipoPago.toString() != "0" && value.tipoPago.toString() != "-") {
                data.tipoPago = value.tipoPago;
              } else {
                data.tipoPago = "-";
              }
              var ammountGraph = "";
              if (value.monto != null && value.monto.toString() != "" && value.monto.toString() != "0" && value.monto.toString() != "-") {
                data.monto = value.monto;
              } else {
                data.monto = "-";
              }
              data.fechaPago = value.fechaPago;
              items.push(data);
              // COMIENZO VERSIONANTIGUA
              graphlabels.push(data.fechaPago);
              graphdataarray.push(data.monto);
              // FIN VERSION ANTIGUA
            });

          }
          response.items = items;
          response.graphlabels = graphlabels.reverse();
          graphdata.push(graphdataarray.reverse());
          response.graphdata = graphdata;
          // options.responsive = false;
          // options.maintainAspectRatio = false;
          response.options = options;
          LocalStorageProvider.setLocalStorageItem('asset_payments_' + index, response);
          defer.resolve(response);
        } else {
          $log.error('Error AssetPayments: ', respuesta.message);
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
        $log.error('Error AssetPayments: ', err);
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

  pub.getBillByDate = function(assetId, bill, email, month) {
    var defer = $q.defer();
    var obj = {};
    obj.path = ENDPOINTS.ENDPOINTS_GET_BILL_BY_DATE;
    obj.method = 'GET';
    obj.contentType = 'application/json';
    obj.params = { 
      numeroSuministro: assetId,
      boleta: bill,
      email: email,
      mes: month
    };
    obj.data = '';

    SalesforceProvider.request(obj).then(function(respuesta) {
      if (respuesta.code.toString() == "200") {
        var data = {};
        if (respuesta.data != null && respuesta.data != '') {
          data.url = respuesta.data.URLBoleta;
          data.numeroSuministroDv = respuesta.data.numero;
          data.email = respuesta.data.email;
          data.detalle = respuesta.data.descripcionResultado;
          data.codigo = respuesta.data.codigoResultado;
          data.boleta = respuesta.data.boleta;
        }
        defer.resolve(data);
      } else {
        $log.error('Error Get Bill By Date: ', respuesta.message);
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
      $log.error('Error Get Bill By Date: ', err);
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
    } else if ((reading == null || reading == '') && (readingDay != null && readingDay != '' && readingNight != null && readingNight != '' && readingPeak != null && readingPeak != '')) {
      obj.params = {
        numeroSuministro: assetId,
        lecturaDia: readingDay,
        lecturaNoche: readingNight,
        lecturaPunta: readingPeak
      };
    } else {
      obj.params = {
        numeroSuministro: assetId
      };
    }
    obj.data = '';

    SalesforceProvider.request(obj).then(function(respuesta) {
      if (respuesta.code.toString() == "200") {
        $log.debug("setEnterReading ", respuesta.data);
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
        if (respuesta.analyticsCode) {
          obj.analyticsCode = respuesta.analyticsCode;
        } else {
          obj.analyticsCode = "ERR999";
        }
        defer.reject(obj);
      }
    }, function(err) {
      $log.error('Error AssetDetail: ', err);
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