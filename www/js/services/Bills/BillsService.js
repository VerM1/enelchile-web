angular.module('BillsModule').factory('BillsService', function($q, SalesforceProvider, ConnectionProvider, $log, ENDPOINTS, UTILS_CONFIG, $base64) {
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
    var val = $base64.encode(xmlTemplate);
    $log.info("val: ", val);
    var valDecode = $base64.decode(val);
    $log.info("valDecode: ", valDecode);

    // val = "deImg2h9+0A8oTAmKCcP9MCiQ+UzJb4xRBKQOUlRr4ardNVJi//mHBe7xcEs0GGy2y8SGLraBB9IWqcF64wUf1/tHqa++H1GgXzanvrcFA2FK8uB0x1f/P1qNqC8z47aRV6Pz5ITzidaIO2Q+qrlaH4vPyu9lYgvipWaQx7eYrT7LwLVtwHwWXg/xGKZFZqDcmCguzzn5ySZUF3A8nXkJEtYxWgPuA9csApi133PgbHqiSCzFQoaAs7XBfEiuonQccdlvQFReyohIKI9Cj9fOUq0Y82+LEomVKoZ/oslTf2Ngn3YtbplpkDHLGQ3RhBc3INMfIN2/X5cpMsYT8rqzwAzznX7vR0JyKZGwA+hh99FhXkOgnBEKah2P/r1+tZSSiNUC4Wyywc4mm5+aVfoWpD6l52NjwT2J3ZWGF+JpYRzuRXcb03hXIEcDVvOECA3Rpa+nYFbQVWf+Xndq+X0pw==";



    defer.resolve(val);
    return defer.promise;
  }


  //PAGO DE DEUDA
  // var setPayment = function(xmlEncoded) {
  //   var defer = $q.defer();
  //   var url = ENDPOINTS.ENDPOINTS_PAYMENT;
  //   var params = {};
  //   var data = {
  //     "val": xmlEncoded
  //   };
  //   var headers = {
  //     'Content-type': 'application/json'
  //   };

  //   ConnectionProvider.sendPost(url, params, data, headers, function(respuesta) {
  //     $log.info('Payment WebPay: ', respuesta);
  //     defer.resolve(respuesta);
  //   }, function(err) {
  //     $log.error('Error Payment WebPay: ' + err);
  //     defer.reject(err);
  //   })
  //   return defer.promise;
  // }



  var setPayment = function(paymentObject) {
    // var defer = $q.defer();
    // // if (paymentObject.montoUltimaBoleta === paymentObject.amount) {
    // //   paymentObject.paymentType = UTILS_CONFIG.PAYMENT_PAYMENTTYPE_1;
    // // } else {
    // //   paymentObject.paymentType = UTILS_CONFIG.PAYMENT_PAYMENTTYPE_2;
    // // }
    // var xmlTemplate = UTILS_CONFIG.PAYMENT_TEMPLATE;
    // $log.info("template previo: ", xmlTemplate);
    // xmlTemplate = xmlTemplate.replace('</banco>', UTILS_CONFIG.PAYMENT_ID_BANK + '</banco>');
    // xmlTemplate = xmlTemplate.replace('</tipoPago>', paymentObject.paymentType + '</tipoPago>');
    // xmlTemplate = xmlTemplate.replace('</monto>', paymentObject.amount + '</monto>');
    // xmlTemplate = xmlTemplate.replace('</fechaVencimiento>', paymentObject.expirationDate + '</fechaVencimiento>');
    // xmlTemplate = xmlTemplate.replace('</fechaEmision>', paymentObject.issueDate + '</fechaEmision>');
    // xmlTemplate = xmlTemplate.replace('</fechaOnClick>', paymentObject.onClickDate + '</fechaOnClick>');
    // xmlTemplate = xmlTemplate.replace('</codigoBarra>', paymentObject.barcode + '</codigoBarra>');
    // xmlTemplate = xmlTemplate.replace('</empresa>', UTILS_CONFIG.PAYMENT_ENTERPRISE + '</empresa>');
    // xmlTemplate = xmlTemplate.replace('</nombre>', paymentObject.name + '</nombre>');
    // xmlTemplate = xmlTemplate.replace('</rut>', paymentObject.rut + '</rut>');
    // xmlTemplate = xmlTemplate.replace('</mail>', paymentObject.email + '</mail>');
    // $log.info("template post: ", xmlTemplate);
    // var val = $base64.encode(xmlTemplate);
    // $log.info("val: ", val);
    // var valDecode = $base64.decode(val);
    // $log.info("valDecode: ", valDecode);
    // var url = ENDPOINTS.ENDPOINTS_PAYMENT;
    // var params = {};
    // var data = {
    //   "val": val
    // };
    // // var data = {
    // //   "val": "deImg2h9+0A8oTAmKCcP9MCiQ+UzJb4xRBKQOUlRr4ardNVJi//mHBe7xcEs0GGy2y8SGLraBB9IWqcF64wUf1/tHqa++H1GgXzanvrcFA2FK8uB0x1f/P1qNqC8z47aRV6Pz5ITzidaIO2Q+qrlaH4vPyu9lYgvipWaQx7eYrQ/lXXYy7wFG9TpsQWip5mjt0W+SyW3RBktsAjDV7X8dBRyy+UnF1IiF6CD+lTABJYliydI270PCnW257DurxcHXutxDpv4Vri0gkiMkCzIpXzWfDcold2zvfhKWGW/VC2Oy9UglalVzRTCwpZEpcHfRczn2D9eN/gFCEyTjp1jX3Saf1ntaYEo29Tj6ArwXB7BKhgzDbq/p48glGEBwi7kmDctcEIZjj2YOSyBchvpOrM18k3yyyMIu9dfbCA9xxlYICWCnsClW3WvtQc3N//BK8Uk8nlbw10TB9V01O7OxA=="
    // // };

    // var headers = {
    //   "Content-Type": "application/x-www-form-urlencoded"
    // };

    // ConnectionProvider.sendPostForm(url, params, data, headers, function(respuesta) {
    //   $log.info('Payment WebPay: ', respuesta);
    //   defer.resolve(respuesta);
    // }, function(err) {
    //   $log.error('Error Payment WebPay: ' + err);
    //   defer.reject(err);
    // })
    // return defer.promise;
  }



  return {
    setEnterReading: setEnterReading,
    generateXmlPayment: generateXmlPayment,
    setPayment: setPayment
  };
});