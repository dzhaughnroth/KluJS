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
var express = require( 'express' );
var argv = require('optimist')
        .usage("Start a simple web server to instrument JS code.")
	    .options("port", {
		    "default" : 7000
	    })
        .describe("port", "Base port to use" )
        .boolean( "phantom" )
        .describe( "phantom", "Start server, run phantom-runner script, and exit." )
        .boolean( "jscoverage" )
        .describe( "jscoverage", "Start and use a jscoverage-server on the next port up." )
        .boolean( "proxy" )
        .describe( "proxy", "Start and use a node-coverage server on the next port up." )
	    .boolean("h").alias("h", "help")
        .argv;

//var spawn = require('child_process').spawn;
var perma = require( './permaProc.js' );
var phanto= require( './phantoProc.js' );
var fs = require('fs');
var vm = require('vm');
var net = require('net');
var proxyMode = false;
var port;

if (argv.h) {
	require("optimist").showHelp();
    process.exit(0);
}

port = parseInt( argv.port );
if ( isNaN( port ) ) {
    util.log( "Illegal port value: " + argv.port );
    process.exit( 1 );
}

//var setIfBlank = function( target, property, value ) {
//    if ( typeof( target[property] ) === "undefined" ) {
//        target[property] = value;
//    }
//};
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

var startJsCoverage = function() {
    proxyMode = true;
    var i;
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

    util.log( "JSCoverage args are " + args );

    var jscov = new perma.ProcManager( "cov", "jscoverage-server", args );
    jscov.startNew();
    process.on( 'exit', function() { jscov.end(); } );
};

var matchesLibDirs = function( url ) {
    for( i in klujs.libDirs ) {
        var pattern = klujs.libDirs[i];
        if ( url.match( pattern ) ) {
            return true;
        }
    }
    return false;
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

var handleByProxy = function(request, response) {
    var self = this;
    var dest = [port+1, "localhost" ];
    // make an http client to the instrumentation server
    var makeProxy = function() { return http.createClient.apply( self, dest ); }; 
    var proxy = makeProxy();
    // ... that sends the same same request  
    var proxy_request = proxy.request(request.method, request.url, request.headers);
    // ... and links the response objects.
    proxy_request.addListener('response', function (proxy_response) {
        // ... by copying the headers.
        response.writeHead(proxy_response.statusCode, proxy_response.headers);
        // ... by copying data as it comes
        proxy_response.addListener('data', function(chunk) {
            response.write(chunk, 'binary');
        });
        // ... by forwarding the ending and error conditions.
        proxy_response.addListener('end', function() {
            response.end();
        });
        proxy_response.addListener('error', function(x) {
            util.log( "respError " + x );
            response.end();
        } );
    });
    request.addListener('data', function(chunk) {
        util.log( "Writing a chunk to proxy. Do I ever?" );
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
};

if ( argv.jscoverage ) {
    startJsCoverage();
}
else {
//    hmm.
}

if ( argv.phantom ) {
    phanto.runPhantom( function( result ) {
        util.log( "Phantom result: " + result );
        process.exit(0);
    } );
}

var app = express.createServer();
app.use( express.logger({ format: 'ZOOT :method :url' }) );
app.use( app.router );
app.use( express.static( __dirname + "/.." ) );

app.get( "/*.js", function( req, res, next ) {
    if ( typeof( req.query.KluJSplain ) !== "undefined" ) {
        next();
    }
    else {
        if ( proxyMode ) {
            handleByProxy( req, res );
        }
        else {
            next();
            //handle with node-coverage
        }
    }
} );

app.get( "/", function( req, res ) {
    res.send( vanillaResponse, { "Content-Type": "text/html" } );
} );

app.listen( port );
util.log( "Listening to " + __dirname );
