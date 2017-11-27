  angular.module('CoreModule').factory('ProfileService',
    function(ConnectionProvider, SalesforceProvider, $q, ENDPOINTS, $log, $ionicLoading, LocalStorageProvider, UTILS_CONFIG) {

      pub.updateUserData = function(checkNotifications, email, cellphone, phone) {
        var defer = $q.defer();
        var obj = {};
        obj.path = ENDPOINTS.ENDPOINTS_EDIT_USER;
        obj.method = 'POST';
        obj.contentType = 'application/json';
        obj.params = {};
        obj.data = {
          bean: {
            checkNotifications: checkNotifications,
            email: email,
            mobilePhone: cellphone,
            homePhone: phone
          }
        };
        $ionicLoading.show({
          template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
        });
        SalesforceProvider.request(obj).then(function(respuesta) {
          $ionicLoading.hide();
          if (respuesta.code.toString() == "200") {
            $log.debug("updateUserData: ", respuesta.message);
            var userData = LocalStorageProvider.getLocalStorageItem("USER_DATA");
            userData.email = email;
            userData.telefonoMovil = cellphone;
            userData.telefonoFijo = phone;
            userData.activarNotificaciones = checkNotifications;
            LocalStorageProvider.setLocalStorageItem("USER_DATA", userData);
            defer.resolve(respuesta);
          } else {
            $log.error('Error changePassword: ', respuesta.message);
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
          $ionicLoading.hide();
          $log.error('Error updateuserData: ', err);
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


      pub.changePassword = function(newPass, confirmNewPass) {
        var defer = $q.defer();

        var obj = {};
        obj.path = ENDPOINTS.ENDPOINTS_PASSWORD_CHANGE;
        obj.method = 'POST';
        obj.contentType = 'application/json';
        obj.params = {};
        obj.data = {
          bean: {
            newPassword: newPass,
            verifyNewPassword: confirmNewPass
          }
        };
        $ionicLoading.show({
          template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
        });
        SalesforceProvider.request(obj).then(function(respuesta) {
          $ionicLoading.hide();
          if (respuesta.code.toString() == "200") {
            $log.debug("changePassword:: ", respuesta.message);
            defer.resolve(respuesta);
          } else {
            $log.error('Error changePassword: ', respuesta.message);
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
          $ionicLoading.hide();
          $log.error('Error changePassword: ', err);
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

      pub.getRelationshipWithAsset = function() {
        var defer = $q.defer();
        var url = ENDPOINTS.ENDPOINTS_BASE_EXTERNAL + ENDPOINTS.ENDPOINTS_EXTERNAL_RELATIONSHIP_WITH_ASSET;
        var params = {};
        var data = {};
        var headers = {
          'Content-type': 'application/json'
        };
        ConnectionProvider.sendGet(url, params, data, headers, function(response) {
          if (response.code == 200) {
            $log.debug('Get getRelationshipWithAsset: ', response.data);
            var obj = [];
            $log.debug("largo: ", response.data.length);
            for (var i = 0; i < response.data.length; i++) {
              obj.push(response.data[i]);
            }
            defer.resolve(obj);
          } else {
            $log.error('Error getRelationshipWithAsset: ' + response.message);
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
          $log.error('Error getRelationshipWithAsset: ' + err);
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

      return pub;

    });