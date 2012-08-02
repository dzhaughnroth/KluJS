/*globals define:false */
define( [ ], function( ) {

    var instrumentCookieName = "klujs-instrument";

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

    
    var Handlers = function( suiteManager, libFilter, codeInstrumenter, allCodeFinder ) {
        this.vanillaResponse = vanillaResponse;
        this.autoSuite = function( req, res, next ) {
            var str = suiteManager.getAsString();            
            res.send( str,
                      {"Content-Type": "text/javascript"} );
            
        };
        this.codeList = function( req, res, next ) {           
            var result = [];
            var found = allCodeFinder.find().found;
            var i;
            for( i = 0; i < found.length; i++ ) {
                if ( libFilter.test( found[i] ) ) {
                    result.push( found[i] );
                }
            }
            res.send( JSON.stringify( result ), 
                      { "Content-Type": "text/javascript" } );
        };
        this.nocov = function(req, res, next) {
            res.cookie( instrumentCookieName, "false" );
            res.send( vanillaResponse, { "Content-Type": "text/html" } );
        };
        this.vanilla = function( req, res, next, noInstr ){
            res.cookie( instrumentCookieName, "true" );
            res.send( vanillaResponse, { "Content-Type": "text/html" } );
        };

        this.js = function( req, res, next ) {
            var instrument = true;
            if ( req.cookies[instrumentCookieName] === "false" ) {
                instrument = false;
            }
            if ( typeof( req.query.KluJSplain ) !== "undefined" ) {
                instrument = false;
            }
            if ( ! libFilter.test( req.url ) ) {
                instrument = false;
            }
            if ( instrument ) {
                codeInstrumenter.handleRequest( req, res );
            }
            else {
                next();
            }
        };
    };
    
    return Handlers;
} );