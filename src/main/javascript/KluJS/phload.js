var page = new WebPage();

var url = "http://localhost:7000/src/test/javascript/klujs.html";

window.setTimeout( function() { 
    console.log( "Too long" );
    page.render( "foo.png" );
    phantom.exit(-4); 
}, 8000 );

var loadFinishedOnce = false;

page.onConsoleMessage = function( msg ) {  
    console.log( "Msg: " + msg );
    var status = page.evaluate( function() {
        if ( typeof( jasmineGradle ) !== "undefined" ) {
            return { status:jasmineGradle.getStatus(),
                     lintFailed:jasmineGradle.lintJobFactory.numFailed(),
                     done:jasmineGradle.isDone() };
        }
        else {
            return { status:"none",
                     lintFailed:0,
                     done:false };
        }
    } );
    if ( status.done ) {
        setTimeout( function() {
            var code = -3;
            if ( status.lintFailed === 0 ) {
                ++code;
            }
            if ( status.status === "passed" ) {
                code += 2;
            }
            console.log( "Code " + code );
            page.render( "foo.png" );
            //        console.log( page.content );
            phantom.exit( code );
        }, 100 );
    }
};

page.onLoadStarted = function() {
    console.log( "Loading something." );
}

page.onLoadFinished = function (status) {
    try {
        console.log( "Opened page " + status + ": " + page);
    }
    catch( x ) {
        console.log( x );
    }
};

page.open(url);



