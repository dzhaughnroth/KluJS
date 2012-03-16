var page = require('webpage').create();
var fs = require('fs');
var url = "http://localhost:7000/KluJS/klujs.html";
var maxMillis = 8000;

var timedOut = false,
    specsPassed = false,
    lintPassed = false;

var summary = function() {
    // TODO add details on tests
    // details on lint
    // details of coverage.
    // preserve API.
    var result = {};
    result.tests = { allPassed : specsPassed };
    result.lint = { allPassed: lintPassed };
    result.finished = !timedOut;
    return result;
};
var exit = function( ) {
    var result = summary();
    page.render( "klujs-image.png" );
    fs.write( "klujs-result.json", JSON.stringify( result ), "w" );    
    var code = 0;
    if ( result.finished !== true ) {
        code = code | 1;
    }
    if ( result.tests.allPassed !== true ) {
        code = code | 2;
    }
    if( result.lint.allPassed !== true ) {
        code = code | 4;
    }
    console.log( "Exit with code " + code );
    phantom.exit( code );
};

window.setTimeout( function() { 
    timedOut = true;
    exit(); 
}, maxMillis );


page.onConsoleMessage = function( msg ) {  
    console.log( "Msg: " + msg ); // pipe to log file instead.
    var status = page.evaluate( function() {
        if ( typeof( jasmineGradle ) !== "undefined" ) {
            return { tests:jasmineGradle.getStatus(),
                     lintFailed:jasmineGradle.lintJobFactory.numFailed(),
                     done:jasmineGradle.isDone() };
        }
        else {
            return { tests:"none",
                     lintFailed:0,
                     done:false };
        }
    } );
    if ( status.done ) {
        setTimeout( function() {
            if ( status.lintFailed === 0 ) {
                lintPassed = true;
            }
            if ( status.tests === "passed" ) {
                specsPassed = true;
            }
            exit();
        }, 100 );
    }
};

page.onLoadFinished = function (status) {
    try {
        console.log( "Opened page " + status + ": " + page);
    }
    catch( x ) {
        console.log( x );
    }
};

page.open(url);



