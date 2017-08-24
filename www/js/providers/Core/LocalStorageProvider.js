/**
 * Created by rodrigopalmafanjul on 20-04-17.
 */
angular.module("CoreModule").provider("LocalStorageProvider", function() { // eslint-disable-line no-undef
  // return {
  //     $get: ["$rootScope", "$window",
  //         function($rootScope, $window) {
  //             var getLocalStorageItem = function(key) {

  //                 var item = $window.localStorage.getItem('Object_' + key);
  //                 if (item) {
  //                     return JSON.parse(item);
  //                 } else {
  //                     item = $window.localStorage.getItem(key);
  //                     if (item) {
  //                         return item;
  //                     }
  //                 }
  //                 return null;
  //             };

  //             var setLocalStorageItem = function(key, value) {
  //                 if (key) {
  //                     if (isJson(value)) {
  //                         $window.localStorage.setItem('Object_' + key, JSON.stringify(value));
  //                     } else {
  //                         $window.localStorage.setItem(key, value);
  //                     }
  //                 } else {
  //                     throw "Key must not be null";
  //                 }
  //             };

  //             var removeLocalStorageItem = function(key) {
  //                 if (key) {
  //                     if (!$window.localStorage.getItem(key)) {
  //                         $window.localStorage.removeItem(key);
  //                     } else if (!$window.localStorage.getItem('Object_' + key)) {
  //                         $window.localStorage.removeItem('Object_' + key);
  //                     } else throw "Key not found";

  //                 } else throw "Key not found";

  //             };


  //             var removeLocalStorageItemStartWithKey = function(startWithKey) {
  //                 if (startWithKey) {
  //                     for (var key in $window.localStorage) {
  //                         if (key.trim().startsWith(startWithKey.trim())) {
  //                             $window.localStorage.removeItem(key);
  //                         } else if (key.trim().startsWith('Object_' + startWithKey.trim())) {
  //                             $window.localStorage.removeItem(key);
  //                         } else throw "Key not found";
  //                     }
  //                 }
  //             };

  //             var removeLocalStorageItemExcept = function(exception) {
  //                 if (exception) {
  //                     for (var key in $window.localStorage) {
  //                         if (exception.indexOf(key) == -1) {
  //                             $window.localStorage.removeItem(key);
  //                         } else {
  //                             console.debug("no elimina la llave: ", key);
  //                         }
  //                     }
  //                 }
  //             };


  //             var getAllLocalStorageItems = function() {
  //                 for (var key in $window.localStorage) {
  //                     console.log("localstorage: ", key);
  //                 }
  //             };

  //             var clearLocalStorage = function(estoySeguro) {
  //                 if (estoySeguro === true) {
  //                     $window.localStorage.clear();
  //                 }
  //             };

  //             var isJson = function(jsonString) {
  //                 try {
  //                     var o = JSON.parse(JSON.stringify(jsonString));
  //                     if (o && typeof o === "object") {
  //                         return true;
  //                     }
  //                 } catch (e) {}

  //                 return false;
  //             };


  //             return {
  //                 getLocalStorageItem: getLocalStorageItem,
  //                 getAllLocalStorageItems: getAllLocalStorageItems,
  //                 setLocalStorageItem: setLocalStorageItem,
  //                 removeLocalStorageItem: removeLocalStorageItem,
  //                 removeLocalStorageItemStartWithKey: removeLocalStorageItemStartWithKey,
  //                 removeLocalStorageItemExcept: removeLocalStorageItemExcept,
  //                 clearLocalStorage: clearLocalStorage
  //             };
  //         }
  //     ]
  // }


  return {
    $get: ["$rootScope", "$window", '$log', 'UTILS_CONFIG',
      function($rootScope, $window, $log, UTILS_CONFIG) {
        var getLocalStorageItem = function(key) {
          var item = $window.localStorage.getItem(key);
          if (item) {
            var plaintext;
            if (UTILS_CONFIG.ENABLE_ENCRYPTION_LOCALSTORAGE) {
              // Decrypt 
              var bytes = CryptoJS.AES.decrypt(item, UTILS_CONFIG.SECRET_KEY_ENCRYPTION);
              var plaintext = bytes.toString(CryptoJS.enc.Utf8);
            } else {
              plaintext = item;
            }

            if (isJson(plaintext)) {
              return JSON.parse(plaintext);
            } else {
              return plaintext;
            }
          } else {
            return null;
          }
        };

        var setLocalStorageItem = function(key, value) {
          if (key) {
            var ciphertext;
            if (isJson(value)) {
              if (UTILS_CONFIG.ENABLE_ENCRYPTION_LOCALSTORAGE) {
                //encrypt
                ciphertext = CryptoJS.AES.encrypt(JSON.stringify(value), UTILS_CONFIG.SECRET_KEY_ENCRYPTION);
              } else {
                ciphertext = JSON.stringify(value);
              }
              $window.localStorage.setItem(key, ciphertext);
            } else {
              if (UTILS_CONFIG.ENABLE_ENCRYPTION_LOCALSTORAGE) {
                //encrypt
                ciphertext = CryptoJS.AES.encrypt(value, UTILS_CONFIG.SECRET_KEY_ENCRYPTION);
              } else {
                ciphertext = value;
              }
              $window.localStorage.setItem(key, ciphertext);
            }
          } else {
            throw "Key must not be null";
          }
        };

        var removeLocalStorageItem = function(key) {
          if (key) {
            if ($window.localStorage.getItem(key)) {
              $window.localStorage.removeItem(key);
            } else throw "Key not found";
          } else throw "Key not found";

        };

        var removeLocalStorageItemExcept = function(exception) {
          if (exception) {
            for (var key in $window.localStorage) {
              if (exception.indexOf(key) == -1) {
                $window.localStorage.removeItem(key);
              } else {
                $log.debug("no elimina la llave: ", key);
              }
            }
          }
        };


        var getAllLocalStorageItems = function() {
          for (var key in $window.localStorage) {
            $log.debug("localstorage: ", key);
          }
        };

        var clearLocalStorage = function(estoySeguro) {
          if (estoySeguro === true) {
            $window.localStorage.clear();
          }
        };

        var isJson = function(jsonString) {
          if (typeof jsonString === "object") {
            return true;
          } else {
            try {
              var o = JSON.parse(jsonString);
              if (o && typeof o === "object") {
                return true;
              }
            } catch (e) {}
          }
          return false;
        };


        return {
          getLocalStorageItem: getLocalStorageItem,
          getAllLocalStorageItems: getAllLocalStorageItems,
          setLocalStorageItem: setLocalStorageItem,
          removeLocalStorageItem: removeLocalStorageItem,
          removeLocalStorageItemExcept: removeLocalStorageItemExcept,
          clearLocalStorage: clearLocalStorage
        };
      }
    ]
  }




});