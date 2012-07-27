/** 
 * KluJS node script
 */
require( "amd-loader" );

define( ["./javascript/autosuite/SuiteManager", "./javascript/server/LibFilter", "./phantoProc.js", "fs", "vm", "net", "http", "util", "express", "optimist", "./lib/node-coverage/lib/report", "./lib/node-coverage/lib/instrument"  ], function( SuiteManager, LibFilter, phanto, fs, vm, net, http, util, express, optimist, report, instrument ) {

    var argv = optimist
            .usage("Start the KluJS server. It serves instrumented Javascript code, and other stuff")
	        .options("port", {
		        "default" : 7000
	        })
            .describe("port", "Base port to use" )
            .boolean( "phantom" )
            .describe( "phantom", "Start server, run phantom-runner script, and exit." )
 	        .boolean("h").alias("h", "help")
            .argv;
    
    if (argv.h) {
	    optimist.showHelp();
        process.exit(0);
    }
    var port;
    port = parseInt( argv.port );
    if ( isNaN( port ) ) {
        util.log( "Illegal port value: " + argv.port );
        process.exit( 1 );
    }

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

    var suiteManager = SuiteManager.create( klujs.test, fs );
    
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
    
    if ( argv.phantom ) {
        phanto.runPhantom( function( result ) {
            util.log( "Phantom result: " + result );
            process.exit(0);
        } );
    }
    
    var libFilter = new LibFilter( klujs );

    var sourceCodeCache = {
	    code : {},
	    highlight : {}
    };
    var docRoot = ".";
    
    var coverageOptions = {
        "function" : undefined,
	    "condition" : true,
	    "doHighlight" : true
    };

    var sendInstrumentedFile = function( req, res ) {
        
	    var instrumentedCode = sourceCodeCache[req.url];
        
	    if (instrumentedCode) {
		    res.send(instrumentedCode.clientCode, {"Content-Type" : "text/javascript"});
	    } else {
		    fs.readFile(docRoot + req.url, "utf-8", function (err, content) {
			    if (err) {
				    res.send("Error while reading " + req.url + err, 500);
			    } else {
				    var code = instrument(req.url, content, coverageOptions);
				    sourceCodeCache.code[req.url] = code.clientCode;
                    
				    if (!coverageOptions.doHighlight) {
					    sourceCodeCache.highlight[req.url] = code.highlightedCode;
					    req.session.highlightInMemory = true;
				    }
                    
				res.send(code.clientCode, {"Content-Type" : "text/javascript"});
			    }
		    });
	    }
    };
    
    var app = express.createServer();
    app.use( express.logger({ format: ':method :url' }) );
    app.use( app.router );
    app.use( express.static( __dirname + "/.." ) );
    
    app.get("/klujs-autoSuites.json", function( req, res, next ) {
        var str = suiteManager.getAsString();
        util.log( str );
        res.send( str,
                  {"Content-Type": "text/javascript"} );
    } );
    
    app.get( "/*.js", function( req, res, next ) {
        if ( typeof( req.query.KluJSplain ) !== "undefined" ) {
            next();
        }
        else {
            if ( libFilter.test( req.url ) ) {
                sendInstrumentedFile( req,res );
            }
            else {
                next();
            }
        }
    } );
    
    app.get( "/", function( req, res ) {
        //    util.log( util.inspect( Object.keys(require('module')._cache) ));//debug
        res.send( vanillaResponse, { "Content-Type": "text/html" } );
    } );
    
    app.listen( port );
    util.log( "Listening to " + __dirname );
} );