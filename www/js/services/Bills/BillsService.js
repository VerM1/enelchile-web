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
      //'numeroSuministro=' + assetId + "&lectura=" + reading;
    } else if ((reading == null || reading == '') && (readingDay != null && readingDay != '' && readingNight != null && readingNight != '' && readingPeak != null && readingPeak != '')) {
      obj.data = {
        bean: {
          numeroSuministro: assetId,
          lecturaDia: readingDay,
          lecturaNoche: readingNight,
          lecturaPunta: readingPeak
        }
      };
      //'numeroSuministro=' + assetId + "&lecturaDia=" + readingDay + "&lecturaNoche=" + readingNight + "&lecturaPunta=" + readingPeak;
    } else {
      obj.data = {
        bean: {
          numeroSuministro: assetId
        }

      };
      //'numeroSuministro=' + assetId;
    }
    obj.params = '';

    SalesforceProvider.request(obj).then(function(respuesta) {
      if (respuesta.code.toString() == "200") {
        $log.info("setEnterReading ", respuesta.data);
        var data = {};
        data.message = respuesta.message;
        if (respuesta.data != null && respuesta.data.length > 0) {
          data.caseId = respuesta.data.caseId;
        }
        defer.resolve(respuesta);
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



  //GENERATE XML PAYMENT
  var generateXmlPayment = function(paymentObject) {
    var defer = $q.defer();
    try {
      var xmlTemplate = UTILS_CONFIG.PAYMENT_TEMPLATE;
      $log.info("template previo: ", xmlTemplate);
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
      $log.info("template post: ", xmlTemplate);
      var wordsEncode = CryptoJS.enc.Utf8.parse(xmlTemplate); // WordArray object
      var val = CryptoJS.enc.Base64.stringify(wordsEncode);
      $log.info("val: ", val);
      var wordsDecode = CryptoJS.enc.Base64.parse(val);
      var valDecode = CryptoJS.enc.Utf8.stringify(wordsDecode);
      $log.info("valDecode: ", valDecode);
      defer.resolve(val);
    } catch (exception) {
      var error = {};
      error.code = "-1";
      error.message = exception;
      defer.reject(error);
    }

    return defer.promise;
  }


  // GENERATE TEMPLATE BILL
  var generateTemplateBillAuth = function(trxId) {
    var defer = $q.defer();
    var obj = {};
    obj.path = ENDPOINTS.ENDPOINTS_ENTER_READING;
    obj.method = 'GET';
    obj.contentType = 'application/json';

    ConnectionProvider.sendPostForm(url, params, data, headers, function(respuesta) {
      $log.info('Payment WebPay: ', respuesta);
      defer.resolve(respuesta);
    }, function(err) {
      $log.error('Error Payment WebPay: ' + err);
      defer.reject(err);
    })
    return defer.promise;
  }


  // GENERATE TEMPLATE BILL
  var generateTemplateBill = function(trxId) {
    var defer = $q.defer();
    var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_GET_ASSET_PROOF_OF_DEBT;
    var params = {
      'trxId': trxId
    };
    var data = {};
    var headers = {
      'Content-type': 'application/json'
    };
    ConnectionProvider.sendGet(url, params, data, headers, function(respuesta) {
      $log.info('Get TemplateBill: ', respuesta);
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
        $log.info("obj: ", obj);
        defer.resolve(obj);
      } else {
        $log.error('Error TemplateBill: ' + respuesta.message);
        var obj = {};
        obj.code = respuesta.code;
        obj.message = respuesta.message;
        defer.reject(obj);
      }
    }, function(err) {
      $log.error('Error TemplateBill: ' + err);
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



  return {
    setEnterReading: setEnterReading,
    generateXmlPayment: generateXmlPayment,
    generateTemplateBillAuth: generateTemplateBillAuth,
    generateTemplateBill: generateTemplateBill
  };
});