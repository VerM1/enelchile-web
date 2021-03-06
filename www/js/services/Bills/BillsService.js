angular.module('BillsModule').factory('BillsService', function($q, SalesforceProvider, ConnectionProvider, $log, ENDPOINTS, UTILS_CONFIG) {
  //INGRESO DE LECTURA
  var setEnterReading = function(assetId, reading, readingDay, readingNight, readingPeak) {
    var defer = $q.defer();
    var obj = {};
    obj.path = ENDPOINTS.ENDPOINTS_ENTER_READING;
    obj.method = 'POST';
    obj.contentType = 'application/json';
    if ((reading != null && reading != '') && (readingDay == null || readingDay == '' || readingNight == null || readingNight == '' || readingPeak == null || readingPeak == '')) {
      obj.data = {
        bean: {
          numeroSuministro: assetId,
          lectura: reading
        }

      };
    } else if ((reading == null || reading == '') && (readingDay != null && readingDay != '' && readingNight != null && readingNight != '' && readingPeak != null && readingPeak != '')) {
      obj.data = {
        bean: {
          numeroSuministro: assetId,
          lecturaDia: readingDay,
          lecturaNoche: readingNight,
          lecturaPunta: readingPeak
        }
      };
    } else {
      obj.data = {
        bean: {
          numeroSuministro: assetId
        }

      };
    }
    obj.params = '';

    SalesforceProvider.request(obj).then(function(respuesta) {
      if (respuesta.code.toString() == "200") {
        $log.debug("setEnterReading ", respuesta.data);
        defer.resolve(respuesta);
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



  //GENERATE XML PAYMENT
  var generateXmlPayment = function(paymentObject) {
    var defer = $q.defer();
    try {
      var xmlTemplate = UTILS_CONFIG.PAYMENT_TEMPLATE;
      $log.debug("template previo: ", xmlTemplate);
      xmlTemplate = xmlTemplate.replace('</banco>', UTILS_CONFIG.PAYMENT_ID_BANK + '</banco>');
      xmlTemplate = xmlTemplate.replace('</tipoPago>', paymentObject.paymentType + '</tipoPago>');
      xmlTemplate = xmlTemplate.replace('</monto>', paymentObject.amount + '</monto>');
      xmlTemplate = xmlTemplate.replace('</fechaVencimiento>', paymentObject.expirationDate + '</fechaVencimiento>');
      xmlTemplate = xmlTemplate.replace('</fechaEmision>', paymentObject.issueDate + '</fechaEmision>');
      xmlTemplate = xmlTemplate.replace('</fechaOnClick>', paymentObject.onClickDate + '</fechaOnClick>');
      xmlTemplate = xmlTemplate.replace('</codigoBarra>', paymentObject.barcode + '</codigoBarra>');
      xmlTemplate = xmlTemplate.replace('</empresa>', UTILS_CONFIG.PAYMENT_ENTERPRISE + '</empresa>');
      xmlTemplate = xmlTemplate.replace('</nombre>', paymentObject.name + '</nombre>');
      xmlTemplate = xmlTemplate.replace('</rut>', paymentObject.rut + '</rut>');
      xmlTemplate = xmlTemplate.replace('</mail>', paymentObject.email + '</mail>');
      $log.debug("template post: ", xmlTemplate);
      var wordsEncode = CryptoJS.enc.Utf8.parse(xmlTemplate); // WordArray object
      var val = CryptoJS.enc.Base64.stringify(wordsEncode);
      $log.debug("val: ", val);
      var wordsDecode = CryptoJS.enc.Base64.parse(val);
      var valDecode = CryptoJS.enc.Utf8.stringify(wordsDecode);
      $log.debug("valDecode: ", valDecode);
      defer.resolve(val);
    } catch (exception) {
      var error = {};
      error.code = "-1";
      error.message = exception;
      error.analyticsCode = "ERR999";
      defer.reject(error);
    }

    return defer.promise;
  }


  // GENERATE TEMPLATE BILL
  // var generateTemplateBillAuth = function(trxId) {
  //   var defer = $q.defer();
  //   var obj = {};
  //   obj.path = ENDPOINTS.ENDPOINTS_ENTER_READING;
  //   obj.method = 'GET';
  //   obj.contentType = 'application/json';

  //   ConnectionProvider.sendPostForm(url, params, data, headers, function(respuesta) {
  //     $log.debug('Payment WebPay: ', respuesta);
  //     defer.resolve(respuesta);
  //   }, function(err) {
  //     $log.error('Error Payment WebPay: ' + err);
  //     defer.reject(err);
  //   })
  //   return defer.promise;
  // }


  // GENERATE TEMPLATE BILL
  var generateTemplateBill = function(trxId, numeroSuministro, email, successCode) {
    var defer = $q.defer();
    var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_EXTERNAL_ASSET_PROOF_OF_DEBT;
    var params = {
      'trxId': trxId,
      'numeroSuministro': numeroSuministro,
      'email': email,
      'successCode': successCode

    };
    var data = {};
    var headers = {
      'Content-type': 'application/json'
    };
    ConnectionProvider.sendGet(url, params, data, headers, function(respuesta) {
      $log.debug('Get TemplateBill: ', respuesta);
      if (respuesta.code.toString() == "200") {
        var obj = {};
        obj.nombreBanco = respuesta.data.nombreBanco;
        obj.numComprobante = respuesta.data.numComprobante;
        obj.codigoBarra = respuesta.data.codigoBarra;
        obj.nombreCliente = respuesta.data.nombreCliente;
        obj.fechaOnClick = respuesta.data.fechaOnClick;
        obj.monto = respuesta.data.monto;
        obj.codigoResultado = respuesta.data.codigoResultado;
        obj.IdTransaccionComercial = respuesta.data.idTransaccionComercial;
        obj.IdTransaccion = respuesta.data.idTransaccion;
        obj.mensaje = respuesta.data.mensaje;
        $log.debug("obj: ", obj);
        defer.resolve(obj);
      } else {
        $log.error('Error TemplateBill: ' + respuesta.message);
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
      $log.error('Error TemplateBill: ' + err);
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



  var paymentStatus = function(numeroSuministro) {
    var defer = $q.defer();
    var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_EXTERNAL_ASSET_PAYMENT_STATUS;
    var params = {
      'numeroSuministro': numeroSuministro

    };
    var data = {};
    var headers = {
      'Content-type': 'application/json'
    };
    ConnectionProvider.sendGet(url, params, data, headers, function(respuesta) {
      $log.debug('Get PaymentStatus: ', respuesta);
      if (respuesta.code.toString() == "200") {
        defer.resolve(respuesta.data);
      } else {
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
      $log.error('Error PaymentStatus: ' + err);
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


  var paymentStatusAuth = function(numeroSuministro) {
    var defer = $q.defer();
    var obj = {};
    obj.path = ENDPOINTS.ENDPOINTS_ASSET_PAYMENT_STATUS;
    obj.method = 'GET';
    obj.contentType = 'application/json';
    obj.params = { 
      numeroSuministro: numeroSuministro
    };
    obj.data = '';

    SalesforceProvider.request(obj).then(function(respuesta) {
      if (respuesta.code.toString() == "200") {
        $log.debug("PaymentStatus", respuesta);
        defer.resolve(respuesta.data);
      } else {
        $log.error('Error PaymentStatus: ', respuesta.message);
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
      $log.error('Error PaymentStatus: ', err.message);
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

  return {
    setEnterReading: setEnterReading,
    generateXmlPayment: generateXmlPayment,
    // generateTemplateBillAuth: generateTemplateBillAuth,
    generateTemplateBill: generateTemplateBill,
    paymentStatus: paymentStatus,
    paymentStatusAuth: paymentStatusAuth
  };
});