var util = require('util');
var spawn = require('child_process').spawn;

var ProcManager = function( name, command, args ) {
    var currentProc;
    var alive = true;
    var log = function( x ) {
        util.log( "ProcManager " + name + ": " + x );
    };
    var end = function() {
        alive = false;
        if ( currentProc ) {
            currentProc.kill( 'SIGTERM' );
        }
        log( "Ended." );
    };
    var startNew = function() {
        if ( alive ) {
            var proc = spawn( command, args );
            proc.on( 'exit', function( code, signal) {
                log( "Process ended: " + code + " " + signal );
//                startNew();
            } );
            proc.stdout.on('data', function (data) {
                log( 'stdout: ' + data);
            });
            proc.stderr.on('data', function (data) {
                log( 'stderr: ' + data);
            } );
            currentProc = proc;
            log( "Started " + currentProc.pid );
        }
    };
    this.end = end;
    this.startNew = startNew;
};

exports.ProcManager = ProcManager;


