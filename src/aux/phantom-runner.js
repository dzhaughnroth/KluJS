var page = require('webpage').create();
var fs = require('fs');
var url = "http://localhost:7000/";
var maxMillis = 30000;

var timedOut = false,
    specsPassed = false,
    lintPassed = false;

var check = function() {
    var status = page.evaluate( function() {
        if ( typeof( klujsPage ) !== "undefined" ) {
            return { done:klujsPage.get("done") };
        }
        else {
            return { done:false };
        }
    } );
    if ( status.done ) {
        setTimeout( function() {
            exit();
        }, 50 );
    }
};

var job = window.setInterval( function() {
    check();
}, 500 );

var results = function( ) {    
    var jsResult = page.evaluate( function() {
        var result = {};
        result.suites = klujsPage.childFrames.summarize();
        result.lint = {
            issues:klujsPage.lintModel.issueCount(),
            failed:klujsPage.lintModel.failed()
        };

        return result;
    } );
    return jsResult;
};

var summary = function(res) {
    var summary = {};
    summary.allLintPassed = res.lint.failed === 0;
    summary.suitesPassed = [];
    summary.suitesFailed = [];
    summary.suiteCoverageFailed = [];
    for( var i in res.suites ) {
        if ( res.suites.hasOwnProperty(i) ) {
            var suite = res.suites[i];
            if( suite.status !== "passed" ) {
                summary.suitesFailed.push( i );
            }
            else {
                summary.suitesPassed.push( i );
            }
            if ( suite.coverageGoalFailures > 0 ) {
                summary.suiteCoverageFailed.push( i );
            }
        }       
    }
    summary.allTestsPassed = summary.suitesFailed.length === 0;
    summary.allCoverageOk = summary.suiteCoverageFailed.length === 0;
    return summary;

};


var exit = function( ) {
    var code = 0;
    try {
        page.render( "phantom-klujs-image.png" );
        var res = results();
        fs.write( "phantom-klujs-result.json", JSON.stringify( res, null, 3 ), "w" );
        var sum = summary(res);
        console.log( JSON.stringify( sum ));
        fs.write( "phantom-klujs-summary.json", JSON.stringify( sum, null, 3 ), "w" );

        if ( !sum.allTestsPassed ) {
            code += 16;
        }
        if ( !sum.allLintPassed ) {
            code += 8;
        }
        if ( !sum.allCoverageOk ) {
            code += 4;
        }
    }
    catch( x ) {
        console.log( "Failed to write results:" );
        console.log( x );
        code += 64;
    }
    if( timedOut ) {
        code += 32;
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
    check();
};

page.onLoadFinished = function (status) {
    console.log( "Opened page " + status + ": " + page);
};

page.open(url);