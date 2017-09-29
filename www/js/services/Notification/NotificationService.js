/**
 * Created by ngajardo on 12-12-2016.
 */
angular.module('NotificationModule').factory('NotificationService', function($q, ConnectionProvider, SalesforceProvider, LocalStorageProvider, $log, ENDPOINTS, UTILS_CONFIG, UtilsService, $rootScope) {

  pub = {};
  //PRIVATE SERVICES
  pub.getNotificationList = function() {
    var defer = $q.defer();
    var obj = {};
    obj.path = ENDPOINTS.ENDPOINTS_NOTIFICATION_LIST;
    obj.method = 'GET';
    obj.contentType = 'application/json';
    obj.params = {};
    obj.data = '';

    SalesforceProvider.request(obj).then(function(respuesta) {
      if (respuesta.code.toString() == "200") {
        $log.debug("getNotificationList ", respuesta.data);
        var items = [];
        var continueSearching = true;
        if (respuesta.data != null && respuesta.data.length > 0) {
          for (var i = 0; i < respuesta.data.length; i++) {
            if (LocalStorageProvider.getLocalStorageItem('notification_list')) {
              items = LocalStorageProvider.getLocalStorageItem('notification_list');
              var found = false;
              //
              for (var j = 0; j < items.length; j++) {
                var fechaAux1 = respuesta.data[i].pushDate.split("/");
                var fechaAux2 = items[j].fecha.split("/");
                var newFormatFechaAux1 = fechaAux1[1] + "/" + fechaAux1[0] + "/" + fechaAux1[2];
                var newFormatFechaAux2 = fechaAux2[1] + "/" + fechaAux2[0] + "/" + fechaAux2[2];
                var dateComapre1 = Date.parse(newFormatFechaAux1);
                var dateComapre2 = Date.parse(newFormatFechaAux2);
                if (dateComapre1 >= dateComapre2) {
                  if (items[j].taskId == respuesta.data[i].taskId) {
                    found = true;
                    break;
                  }
                } else {
                  continueSearching = false;
                  found = true;
                  break;
                }

              }
              if (!found) {
                $log.debug(i + ' : ', respuesta.data[i]);
                var data = {};
                data.taskId = respuesta.data[i].taskId;
                data.titulo = respuesta.data[i].title;
                data.mensaje = respuesta.data[i].body;
                data.fecha = respuesta.data[i].pushDate;
                data.status = respuesta.data[i].status;
                items.unshift(data);
                LocalStorageProvider.setLocalStorageItem('notification_list', items);
                // LocalStorageProvider.setLocalStorageItem('notification_count', getUnreadNotifications());
                getUnreadNotifications();
              }
              //
            } else {
              $log.debug(i + ' : ', respuesta.data[i]);
              var data = {};
              data.taskId = respuesta.data[i].taskId;
              data.titulo = respuesta.data[i].title;
              data.mensaje = respuesta.data[i].body;
              data.fecha = respuesta.data[i].pushDate;
              data.status = respuesta.data[i].status;
              items.push(data);

            }
            if (!continueSearching) {
              break;
            }
          }
        } else {
          if (LocalStorageProvider.getLocalStorageItem('notification_list')) {
            items = LocalStorageProvider.getLocalStorageItem('notification_list');
          }
          $log.error('no hay elementos de notificaciones');
          // var obj = {};
          // obj.code = respuesta.code;
          // obj.message = $rootScope.translation.NO_DATA_NOTIFICATION;
          // if (respuesta.analyticsCode) {
          //   obj.analyticsCode = respuesta.analyticsCode;
          // } else {
          //   obj.analyticsCode = "ERR999";
          // }
          // defer.reject(obj);
        }
        LocalStorageProvider.setLocalStorageItem('notification_list', items);
        // LocalStorageProvider.setLocalStorageItem('notification_count', getUnreadNotifications());
        getUnreadNotifications();
        defer.resolve(LocalStorageProvider.getLocalStorageItem('notification_list'));
      } else {
        if (LocalStorageProvider.getLocalStorageItem('notification_list')) {
          defer.resolve(LocalStorageProvider.getLocalStorageItem('notification_list'));
          // LocalStorageProvider.setLocalStorageItem('notification_count', getUnreadNotifications());
          getUnreadNotifications();
        } else {
          $log.error('Error NotificationList: ', respuesta.message);
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
      }
    }, function(err) {
      if (LocalStorageProvider.getLocalStorageItem('notification_list') && LocalStorageProvider.getLocalStorageItem('notification_list').length > 0) {
        defer.resolve(LocalStorageProvider.getLocalStorageItem('notification_list'));
        // LocalStorageProvider.setLocalStorageItem('notification_count', getUnreadNotifications());
        getUnreadNotifications();
      } else {
        $log.error('Error NotificationList: ', err);
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
      }

    });

    return defer.promise;
  };


  //PRIVATE SERVICES
  pub.updateNotification = function(item, action) {
    var taskId = item.taskId
    var defer = $q.defer();
    var obj = {};
    obj.path = ENDPOINTS.ENDPOINTS_UPDATE_NOTIFICATION;
    obj.method = 'POST';
    obj.contentType = 'application/json';
    obj.params = {};
    obj.data = {
      bean: {
        taskId: taskId,
        action: action
      }
    };

    SalesforceProvider.request(obj).then(function(respuesta) {
      if (respuesta.code.toString() == "200") {

        $log.debug("updateNotification", respuesta);
        var notificationList = {};
        if (LocalStorageProvider.getLocalStorageItem('notification_list')) {
          notificationList = LocalStorageProvider.getLocalStorageItem('notification_list');
          if (action === UTILS_CONFIG.NOTIFICATION_UPDATE_TYPE_01) {
            for (var i = 0; i < notificationList.length; i++) {
              if (item.taskId == notificationList[i].taskId) {
                notificationList[i].status = UTILS_CONFIG.NOTIFICATION_STATUS_NOTIFICATION_01;
                break;
              }
            }
          } else if (action === UTILS_CONFIG.NOTIFICATION_UPDATE_TYPE_02) {
            for (var i = 0; i < notificationList.length; i++) {
              if (item.taskId == notificationList[i].taskId) {
                // notificationList.splice(notificationList.indexOf(item), 1);
                notificationList.splice(i, 1);
                break;
              }
            }
          }
          LocalStorageProvider.removeLocalStorageItem('notification_list');
          LocalStorageProvider.setLocalStorageItem('notification_list', notificationList);
          // LocalStorageProvider.setLocalStorageItem('notification_count', getUnreadNotifications());
          getUnreadNotifications();
        }
        var response = LocalStorageProvider.getLocalStorageItem('notification_list');
        // var response = notificationList;
        defer.resolve(response);
      } else {
        $log.error('Error updateNotification: ', respuesta.message);
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
      $log.error('Error updateNotification: ', err);
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

  var getUnreadNotifications = function() {
    if (LocalStorageProvider.getLocalStorageItem('notification_list')) {
      var notifications = LocalStorageProvider.getLocalStorageItem('notification_list');
      var unreadNotifications = 0;
      notifications.forEach(function(notification) {
        if (notification.status != UTILS_CONFIG.NOTIFICATION_STATUS_NOTIFICATION_01) {
          unreadNotifications++;
        }
      });
      $rootScope.countNotification = unreadNotifications;
      UtilsService.setBadgeNumber(unreadNotifications);
      return (unreadNotifications);
    } else {
      UtilsService.setBadgeNumber(0);
      $rootScope.countNotification = 0;
      return 0;
    }
  };
  return pub;
});