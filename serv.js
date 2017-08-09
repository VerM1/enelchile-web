
/*
// modules
var static = require( 'node-static' ),
    port = 8080,
    http = require( 'http' );

// config
var file = new static.Server( './www', {
    cache: 3600,
    gzip: true
} );

// serve
http.createServer( function ( request, response ) {
    request.addListener( 'end', function () {
        file.serve( request, response );
    } ).resume();
} ).listen( port );
*/

var express = require('express');
var port = process.env.PORT || 3000;
var app = express.createServer();

app.get('/', function(request, response) {
    //response.sendfile(__dirname + '/index.html');
	response.sendfile('./www/index.html');
}).configure(function() {
    app.use('/images', express.static(__dirname + '/images'));
}).listen(port);
