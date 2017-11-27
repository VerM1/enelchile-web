angular.module('ContactModule').factory('ContactService', function(ConnectionProvider, SalesforceProvider, $q, ENDPOINTS, $log, LocalStorageProvider) {
  var getBranchesItems = function() {
    var defer = $q.defer();
    if (LocalStorageProvider.getLocalStorageItem('branches')) {
      defer.resolve(LocalStorageProvider.getLocalStorageItem('branches'));
    } else {
      var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_BRACNHES;
      var params = {};
      var data = {};
      var headers = {
        'Content-type': 'application/json'
      };
      var markers = {};
      var markersBranches = [];
      var markersPaymentPlaces = [];

      ConnectionProvider.sendGet(url, params, data, headers, function(response) {
        if (response.code == 200) {
          $log.debug('Get Data: ', response);
          for (var i = 0; i < response.data.length; i++) {
            var obj = {
              'index': i,
              'titulo': response.data[i].titulo,
              'tipo': response.data[i].tipo,
              'latitud': response.data[i].latitud,
              'longitud': response.data[i].longitud,
              'direccion': response.data[i].direccion,
              'detalle': response.data[i].detalle,
              'horario_apertura': response.data[i].horaApertura,
              'horario_pago': response.data[i].horaPago,
              'horario_especial': response.data[i].horaEspecial,
              'imagen': response.data[i].imagen
            };
            $log.debug("obj: ", obj);
            if (obj.tipo == '01') {
              markersBranches.push(obj);
            } else {
              markersPaymentPlaces.push(obj);
            }
          }
          markers.branches = markersBranches;
          markers.paymentPlaces = markersPaymentPlaces;
          LocalStorageProvider.setLocalStorageItem('branches', markers);
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
          LocalStorageProvider.setLocalStorageItem("last_request_sf_time_branches", actualDate);
          defer.resolve(markers);
        } else {
          $log.error('Get Data: ' + response.message);
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
        $log.error('Get Data: ' + err);
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





  var setContactForm = function(numeroSuministro, asunto, rut, nombres, apellidoPaterno, email, telefono, movil, descripcion) {
    var defer = $q.defer();
    var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_EXTERNAL_SETCONTACT;
    var data = {
      bean: {
        numeroSuministro: numeroSuministro,
        asunto: asunto,
        rut: rut,
        nombres: nombres,
        apellidoPaterno: apellidoPaterno,
        email: email,
        telefonoPrimario: telefono,
        telefonoSecundario: movil,
        descripcion: descripcion
      }
    };
    var params = {};
    var headers = {
      'Content-type': 'application/json'
    };

    ConnectionProvider.sendPost(url, params, data, headers, function(response) {
      if (response.code == 200) {
        $log.debug('Set Contact: ', response);
        defer.resolve(response);
      } else {
        $log.error('Get Data: ' + response.message);
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
      $log.error('Set Contact: ' + err);
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




  var setContactFormAuth = function(numeroSuministro, asunto, descripcion) {
    var defer = $q.defer();
    var obj = {};
    obj.path = ENDPOINTS.ENDPOINTS_SETCONTACT;
    obj.method = 'POST';
    obj.contentType = 'application/json';
    obj.data = {
      bean: {
        numeroSuministro: numeroSuministro,
        asunto: asunto,
        descripcion: descripcion
      }
    };
    obj.params = '';

    SalesforceProvider.request(obj).then(function(respuesta) {
      if (respuesta.code.toString() == "200") {
        $log.debug("Set Contact Auth ", respuesta);
        defer.resolve(respuesta);
      } else {
        $log.error('Error Set Contact Auth: ', respuesta.message);
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
      $log.error('Error Set Contact Auth: ', err);
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


  var geocodeLatLng = function(latitude, longitude) {
    var defer = $q.defer();
    var geocoder = new google.maps.Geocoder;
    var latlng = {
      lat: parseFloat(latitude),
      lng: parseFloat(longitude)
    };
    geocoder.geocode({
      'location': latlng
    }, function(results, status) {
      if (status === 'OK') {
        if (results[1]) {
          defer.resolve(results[0].formatted_address);
        } else {
          $log.error("No results found");
        }
      } else {
        $log.error('Geocoder failed due to: ' + status);
        defer.reject(status);
      }
    });
    return defer.promise;
  };

  return {
    getBranchesItems: getBranchesItems,
    setContactForm: setContactForm,
    setContactFormAuth: setContactFormAuth,
    geocodeLatLng: geocodeLatLng
  }
});