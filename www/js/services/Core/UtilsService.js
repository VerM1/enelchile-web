angular.module('CoreModule').factory('UtilsService', function(SalesforceProvider, $q, ENDPOINTS, $log, SALESFORCE_CONFIG, LocalStorageProvider, ConnectionProvider, AccessService, $state, $route, $ionicLoading) {

  pub = {};
  // PUBLIC SERVICES
  pub.getStates = function() {
    var defer = $q.defer();
    if (LocalStorageProvider.getLocalStorageItem("states") && LocalStorageProvider.getLocalStorageItem("states").length > 0) {
      defer.resolve(LocalStorageProvider.getLocalStorageItem("states"));
      $log.info('getStates: ', LocalStorageProvider.getLocalStorageItem("states"));
    } else {
      var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_GET_STATES;
      var params = {};
      var data = {};
      var headers = {
        'Content-type': 'application/json'
      };
      ConnectionProvider.sendGet(url, params, data, headers, function(response) {
        if (response.code == 200) {
          $log.info('Get getStates: ', response.data);
          var obj = [];
          $log.info("largo: ", response.data.length);
          for (var i = 0; i < response.data.length; i++) {
            obj.push(response.data[i]);
          }
          LocalStorageProvider.setLocalStorageItem("states", obj);
          defer.resolve(obj);
        } else {
          $log.error('Error getStates: ' + response.message);
          var obj = {};
          obj.code = response.code;
          obj.message = response.message;
          defer.reject(obj);
        }

      }, function(err) {
        $log.error('Error getStates: ' + err);
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

  //  PRIVATE SERVICES
  pub.getAssetList = function() {
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








  //  PUBLIC SERVICES

  pub.getAssetDebt = function(assetNumber) {
    var defer = $q.defer();
    if (LocalStorageProvider.getLocalStorageItem('asset_debt_')) {
      defer.resolve(LocalStorageProvider.getLocalStorageItem('asset_debt_'));
    } else {
      var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_GET_ASSET_DEBT;
      var params = {
        'numeroSuministro': assetNumber
      };
      var data = {};
      var headers = {
        'Content-type': 'application/json'
      };

      ConnectionProvider.sendGet(url, params, data, headers, function(respuesta) {
        if (respuesta.code.toString() == "200") {
          $log.info("getAssetList ", respuesta.data);
          var obj = {};
          LocalStorageProvider.setLocalStorageItem('asset_debt_', respuesta.data);
          defer.resolve(respuesta.data);
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


  pub.getSubjectList = function() {
    var defer = $q.defer();
    if (LocalStorageProvider.getLocalStorageItem('subject_list')) {
      defer.resolve(LocalStorageProvider.getLocalStorageItem('subject_list'));
    } else {
      var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_EXTERNAL_SUBJECT;
      var params = {};
      var data = {};
      var headers = {
        'Content-type': 'application/json'
      };

      ConnectionProvider.sendGet(url, params, data, headers, function(respuesta) {
        if (respuesta.code.toString() == "200") {
          $log.info("getAssetList ", respuesta.data);
          LocalStorageProvider.setLocalStorageItem('subject_list', respuesta.data);
          defer.resolve(respuesta.data);
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


  return pub;




  // var tooltip = function(title, content, type, buttons, options) {
  //     PopupFactory.show(title, content, type || 'info', buttons, options);
  // };

  // var showAlert = function(tit, msg) {
  //     return $ionicPopup.alert({
  //         title: tit,
  //         template: msg
  //     });
  // };

  // var url = ENDPOINTS.URL;
  // var headers = {
  //     'Content-type': 'application/json'
  // };
  // var method = "POST";





  // return {
  //     tooltip: tooltip,
  //     showAlert: showAlert,
  //     getURL: url,
  //     getHeaders: headers,
  //     getMethod: method
  // }




})