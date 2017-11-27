angular.module('FeaturedModule').factory('FeaturedService', function(ConnectionProvider, $q, ENDPOINTS, $log, LocalStorageProvider) {
  var getFeaturedItems = function() {
    var defer = $q.defer();
    var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_FEATURED;
    var params = {};
    var data = {};
    var headers = {
      'Content-type': 'application/json'
    };

    if (LocalStorageProvider.getLocalStorageItem('featured_list')) {
      defer.resolve(LocalStorageProvider.getLocalStorageItem('featured_list'));
    } else {
      ConnectionProvider.sendGet(url, params, data, headers, function(respuesta) {
        if (respuesta.code.toString() == "200") {
          $log.debug('Get Data: ', respuesta);
          var featuredList = []
          angular.forEach(respuesta.data, function(value, key) {
            var obj = {
              'index': key,
              'titulo': value.titulo,
              'subtitulo': value.subTitulo,
              'detalle': value.detalle,
              'url': value.url,
              'imagen': value.imagen
            };
            featuredList.push(obj);
          });
          LocalStorageProvider.setLocalStorageItem('featured_list', featuredList);
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
          LocalStorageProvider.setLocalStorageItem("last_request_sf_time_featured", actualDate);
          defer.resolve(featuredList);
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
        $log.error('Error Get Data: ' + err);
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

  return {
    getFeaturedItems: getFeaturedItems
  }
});