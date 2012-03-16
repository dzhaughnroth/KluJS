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
var spawn = require('child_process').spawn;
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


var spawnCov = function( name, args ) {
    console.log( "Spawning " + name + " with " + args );
    var command = "jscoverage-server";
    var doSpawn = function() {
        var p = spawn( command, args );    
        p.stdout.on('data', function (data) {
            util.log( name + ' out: ' + data);
        });

        p.stderr.on('data', function (data) {
            util.log( name + ' err: ' + data);
        });
        
        p.on('exit', function (code) {
            util.log( name + ' Exited with code ' + code);
            util.log( "I can't work like this. But I'll try." );
            spawn( command, args );
            util.log( "New pid " + p.pid );
        });
        return p;
    };

    var procHolder = doSpawn(); 

//on( 'error', function( code ) {
//    util.log( name + ' errored with code ' + code);
//    util.log( "I can't work like this. But I'll try." );
//    p = spawn( command, args );
//} );


    return {proc: function() { return p; } };
};



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

jscov = spawnCov( "cov", args );

nocov = spawnCov( "nocov", ["--no-instrument=src", "--no-instrument=klujs-config.js", "--no-instrument=KluJS", "--port=7002", "--verbose"] );

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


http.createServer(function(request, response) {
    var dest = routeRequest( request );
    var proxy = http.createClient.apply( this, dest );
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

