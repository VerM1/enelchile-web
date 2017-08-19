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
          defer.resolve(featuredList);
        } else {
          $log.error('Error Get Data: ' + respuesta.message);
          var obj = {};
          obj.code = respuesta.code;
          obj.message = respuesta.message;
          defer.reject(obj);
        }

      }, function(err) {
        $log.error('Error Get Data: ' + err);
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

  return {
    getFeaturedItems: getFeaturedItems
  }
});