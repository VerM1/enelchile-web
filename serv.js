// modules
var static = require( 'node-static' ),
    port = process.env.PORT || 3000;
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
