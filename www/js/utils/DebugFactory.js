//TODO:eliminar antes de pasar a produccion.
angular.module('CoreModule').factory('DebugFactory', ['$window', '$cordovaDevice', function($window, $cordovaDevice) {
  var fileDebug = 'enel-regional.report.txt';

  var options = {
    create: true
  };

  var file = function(lineReport) {
    try {
      var path = ($cordovaDevice.getPlatform() === 'iOS') ? cordova.file.dataDirectory : cordova.file.externalDataDirectory;
      $window.resolveLocalFileSystemURL(path, function(fileSystem) {
        fileSystem.getFile(fileDebug, options, function(fileEntry) {
          fileEntry.file(function(fileData) {
            if (fileData.size < 100000) {
              var reader = new FileReader(); /* globals FileReader */
              reader.onloadend = function(evt) {
                if (evt.target.result !== undefined || evt.target.result !== null) {
                  if (evt.target.result.length === 0) {
                    fileEntry.createWriter(function(writer) {
                      var base = '{{<><><>}}';
                      var line = base.replace('{{<><><>}}', '{{<><><>}}' + lineReport);
                      writer.seek(0);
                      writer.write(line);
                    });
                  } else {
                    fileEntry.createWriter(function(writer) {
                      writer.seek(0);
                      var line = evt.target.result;
                      line = line.replace('{{<><><>}}', '{{<><><>}}' + lineReport);
                      writer.write(line);
                    });
                  }
                }
              };
              reader.readAsText(fileData);
            } else {
              fileEntry.remove(function() {
                file(lineReport);
              }, function() {
                /* Ignore Error */
              });
            }
          });
        }, function() {
          /* Ignore Error */
        });
      }, function() {
        /* Ignore Error */
      });
    } catch (err) { /* Ignore Error */ }
  };

  var put = function() {
    var i;
    var time = new Date();
    var lineReport = '';

    for (i in arguments) {
      if (typeof arguments[i] === 'object') {

        lineReport += '::Object|| ';
        lineReport += angular.toJson(arguments[i]);
        lineReport += ' ||EndObject::';
      } else {
        /*jshint eqeqeq:false*/
        if (i === 0) { //eslint-disable-line
          lineReport += arguments[i];
        } else {
          lineReport += arguments[i] + ' ';
        }
      }
      /*jshint eqeqeq:false*/
      if (i === 0) { //eslint-disable-line
        lineReport += ':|' + time.toString() + '|: ';
      }

    }
    lineReport += '\n';
    file(lineReport);
  };
  return {
    put: put
  };
}]);