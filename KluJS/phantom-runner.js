var page = require('webpage').create();
var fs = require('fs');
var url = "http://localhost:7000/";
var maxMillis = 8000;

var timedOut = false,
    specsPassed = false,
    lintPassed = false;

var results = function( ) {
    var goo = page.evaluate( function() {
        var results = jasmineKlujs.getResults();
        var result = [];
        $.each( results, function( i, runnerResult ) {
            result[i] =  {
                path:runnerResult.path, // a url
                failedCount:runnerResult.failedCount,
                specs:[]
            };
            $.each( runnerResult.specs, function( j, item ) {  
                result[i].specs.push( 
                    { path:item.path,
                      passed:item.passed,
                      stacktrace:item.stacktrace,
                      message:item.message
                    }
                );
            } );

        } );
        return result;
    } );

    return goo;
};

var failures = function( ) {
    var out = [];
    var result = results();
    var i, j;
    for( i = 0; i < result.length; i++ ) {
        var aResult = result[i];
        if ( aResult.failedCount !== 0 ) {
            out.push( aResult );
            var specs = aResult.specs;
            aResult.specs = [];
            for ( j = 0; j < specs.length; j++ ) {
                var x = specs[j];
                if ( !x.passed ) {
                    aResult.specs.push( x );
                }
            }
        }
    }
    return out;

};

var summary = function() {
    // TODO add details on tests
    // details on lint
    // details of coverage.
    // preserve API.
    var result = {};
    result.tests = { allPassed : specsPassed };
    result.lint = { allPassed: lintPassed };
    result.finished = !timedOut;
    result.failures = failures();
    return result;
};

var exit = function( ) {
    var result = summary();
    page.render( "phantom-klujs-image.png" );
    fs.write( "phantom-klujs-summary.json", JSON.stringify( result, null, 3 ), "w" );
    result.results = results();
    fs.write( "phantom-klujs-result.json", JSON.stringify( result, null, 3 ), "w" );
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
        if ( typeof( jasmineKlujs ) !== "undefined" ) {
            return { tests:jasmineKlujs.getStatus(),
                     lintFailed:jasmineKlujs.lintJobFactory.numFailed(),
                     done:jasmineKlujs.isDone() };
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



