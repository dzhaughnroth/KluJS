var util = require( "util" );
var spawn = require( "child_process" ).spawn;

var phantomExecutable = "phantomjs";

var log = function(msg) {
    util.log( "PhatomJS runner: " + msg );
};

var runPhantom = function( callback, klujsDir, port ) {
    var proc = spawn( phantomExecutable, [ klujsDir + "/phantom-runner.js", port] );
    proc.on( 'exit', function( code, signal) {
        log( "PhantomJs ended: " + code + " " + signal );
        callback( code );
    } );
    proc.stdout.on('data', function (data) {
        log( 'stdout: ' + data);
    });
    proc.stderr.on('data', function (data) {
        log( 'stderr: ' + data);
    } );

};

exports.runPhantom = runPhantom;

