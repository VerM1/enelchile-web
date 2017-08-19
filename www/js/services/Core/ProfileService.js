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
            $log.info("updateUserData: ", respuesta.message);
            var userData = LocalStorageProvider.getLocalStorageItem("USER_DATA");
            userData.email = email;
            userData.telefonoMovil = cellphone;
            userData.telefonoFijo = phone;
            userData.activarNotificaciones = checkNotifications;
            LocalStorageProvider.setLocalStorageItem("USER_DATA", userData);
            defer.resolve(respuesta.message);
          } else {
            $log.error('Error changePassword: ', respuesta.message);
            var obj = {};
            obj.code = respuesta.code;
            obj.message = respuesta.message;
            defer.reject(obj);
          }
        }, function(err) {
          $ionicLoading.hide();
          $log.error('Error updateuserData: ', err);
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
            $log.info("changePassword:: ", respuesta.message);
            defer.resolve(respuesta.message);
          } else {
            $log.error('Error changePassword: ', respuesta.message);
            var obj = {};
            obj.code = respuesta.code;
            obj.message = respuesta.message;
            defer.reject(obj);
          }
        }, function(err) {
          $ionicLoading.hide();
          $log.error('Error changePassword: ', err);
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
      };
      return pub;

    });