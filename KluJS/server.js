/** KluJS proxy is a Node.js script
 *  It listens on port 7000.
 *  It starts JSCoverage servers on ports 7001 and 7002
 *  The one on 7002 actually instruments nothing, so it
 *  is okay to apply jslint to the result.
 *  Requests are routed to one or the other based on the URL
 *  ending in the term "KluJSplain" HaHa.
 */
var http = require('http');
var util = require('util');
//var spawn = require('child_process').spawn;
var perma = require( './permaProc.js' );
var phanto= require( './phantoProc.js' );
var fs = require('fs');
var vm = require('vm');
var port = 7000;
var config;

var setIfBlank = function( target, property, value ) {
    if ( typeof( target[property] ) === "undefined" ) {
        target[property] = value;
    }
};
try {
    var configString = fs.readFileSync( "klujs-config.js", "UTF8" );
    vm.runInThisContext( configString, "klujs-config.js" );    
}
catch( ex ) {
    throw( "Could not load/run klujs.config: " + ex );
};
klujs.noBoot = true;
try {
    var bootString = fs.readFileSync( "KluJS/boot.js", "UTF8" );
    vm.runInThisContext( bootString, "KluJS/boot.js" );
}
catch( ex ) {
    throw( "Could not load KluJS/boot.js?!?: " + ex );
}

var jscov, nocov, i;

var args = ["--verbose", "--port=" + (port+1)];
if ( klujs.libDirs ) {
    for( i in klujs.libDirs ) {
        args.push( "--no-instrument=" + klujs.libDirs[i] );
    }
}


if ( true !== klujs.noDefaultFilter ) {
    args.push( "--no-instrument=KluJS" );
    var relReqHome = 
            klujs.requireHome.substring( 3, klujs.requireHome.length );
    args.push( "--no-instrument=" + relReqHome );
}

util.log( "Args are " + args );

jscov = new perma.ProcManager( "cov", "jscoverage-server", args );

nocov = new perma.ProcManager( "noc", "jscoverage-server", ["--no-instrument=" + klujs.src, "--no-instrument=klujs-config.js", "--no-instrument=KluJS", "--port=7002", "--verbose"] );

jscov.startNew();
nocov.startNew();

var matchesLibDirs = function( url ) {
    for( i in klujs.libDirs ) {
        var pattern = klujs.libDirs[i];
        if ( url.match( pattern ) ) {
            return true;
        }
    }
    return false;
};

var routeRequest = function( request ) {
    var targetPort = port + 1;
    if ( request.url.match( /KluJSplain$/ ) 
         || matchesLibDirs( request.url ) ){
        targetPort = port + 2;
    }
    return [ targetPort, "localhost" ];
};

var vanillaResponse = [
    "<html>",
    "<head>",
    "  <title>KluJS</title>",
    "  <script type='text/javascript' src='klujs-config.js'></script>",
    "  <script type='text/javascript' src='KluJS/boot.js' ></script>",
    "</head>",
    "<body />",
    "</html>",
    ""].join( "\n" );

var handleRequest = function( req, res ) {
    res.writeHead( 200, { "Content-Type": "text/html" });
    res.write( vanillaResponse, "utf8" );
    res.end();
};

var startServer = function() {
    return http.createServer(function(request, response) {
        var self = this;
        if ( request.url === "/" || request.url.match( /\/\?/ ) ) {
            handleRequest( request, response );
        return;
    }
    var dest = routeRequest( request );
    var makeProxy = function() { return http.createClient.apply( self, dest ); };

    var proxy = makeProxy();
    util.log( request.method + " " + request.url + " " + dest + " " + request.headers.host);
    var proxy_request = proxy.request(request.method, request.url, request.headers);
    proxy_request.addListener('response', function (proxy_response) {
        proxy_response.addListener('data', function(chunk) {
            response.write(chunk, 'binary');
        });
        proxy_response.addListener('end', function() {
            response.end();
        });
        proxy_response.addListener('error', function(x) {
            util.log( "respError " + x );
            response.end();
        } );        
        response.writeHead(proxy_response.statusCode, proxy_response.headers);
    });
    request.addListener('data', function(chunk) {
        proxy_request.write(chunk, 'binary');
    });
    request.addListener('end', function() {
        proxy_request.end();
    });
    proxy.addListener('error', function(x) {
        util.log( "Error " + x );
        util.log( "I think you have unparsable javascript" );
    } );
    proxy_request.addListener( 'error', function(x) {
        util.log( "Error proxyreq " + x );
    });
}).listen(port);

};

startServer();

if ( process.argv[2] === "phantom" ) {
    phanto.runPhantom( function( result ) {
        util.log( "Phantom result: " + result );
        process.exit(0);
    } );
}

process.on( 'exit', function() {
    util.log( "Exiting." );
    jscov.end();
    util.log( "jscov exit" );
    nocov.end();
    util.log( "nocov exit" );
} );

