/** KluJS proxy is a Node.js script
 *  It listens on port 7000.
 *  It starts JSCoverage servers on ports 8000 and 8001
 *  The one on 8001 actually instruments nothing, so it
 *  is okay to apply jslint to the result.
 *  Requests are routed to one or the other based on the URL
 *  ending in the term "KluJSplain" HaHa.
 */
var http = require('http');
var util = require('util');
var spawn = require('child_process').spawn;

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



var jscov, nocov;

jscov = spawnCov( "cov", ["--verbose",
            "--no-instrument=src/test/javascript/lib",
            "--no-instrument=src/main/javascript/nonfluff/lib",
            "--no-instrument=src/main/javascript/require-jquery.js"
           ] );

nocov = spawnCov( "nocov", ["--no-instrument=src", "--port=8081", "--verbose"] );


http.createServer(function(request, response) {
    var targetPort = 8080;
    if ( request.url.match( /KluJSplain$/ ) ){
        targetPort = 8081;
    }
    var proxy = http.createClient(targetPort, "localhost" );
    util.log( request.method + " " + request.url + " " + targetPort + " " + request.headers.host);
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
}).listen(7000);

