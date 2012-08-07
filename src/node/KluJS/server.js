/** 
 * KluJS node script
 */

define( ["./javascript/autosuite/SuiteManager", "./javascript/server/LibFilter", "./javascript/server/CodeInstrumenter", "./javascript/deadcode/AllCodeFinder", "./javascript/server/Handlers", "./phantoProc.js", "fs", "vm", "net", "http", "util", "express", "optimist", "./lib/node-coverage/lib/report", "./lib/node-coverage/lib/instrument"  ], function( SuiteManager, LibFilter, CodeInstrumenter, AllCodeFinder, Handlers, phanto, fs, vm, net, http, util, express, optimist, report, instrument ) {

    var argv = optimist
            .usage("Start the KluJS server. It serves instrumented Javascript code, and other stuff")
	        .options("port", {
		        "default" : 7000
	        })
            .describe("port", "Port to use" )
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
        var bootString = fs.readFileSync( __dirname + "/boot.js", "UTF8" );
        vm.runInThisContext( bootString, __dirname + "/boot.js" );
    }
    catch( ex ) {
        throw( "Could not load KluJS/boot.js: " + ex );
    }
    
    var suiteManager = SuiteManager.create( klujs.test, fs );   
    
    var libFilter = new LibFilter( klujs );

    var docRoot = ".";
    
    var coverageOptions = {
        "function" : undefined,
	    "condition" : true,
	    "doHighlight" : true
    };

    var codeInstrumenter = new CodeInstrumenter( fs, docRoot, instrument, coverageOptions);
    var codeLister = new AllCodeFinder( klujs.src, fs );
    var app = express.createServer();
    app.use( express.logger({ format: ':method :url' }) );
    app.use( express.cookieParser());
    app.use( app.router );
    app.use( express.static( process.cwd() ));

    var klujsStatic = express.static( __dirname + "/.." );
    // configure Router
    var handlers = new Handlers( suiteManager, libFilter, codeInstrumenter, codeLister );

    app.get("/klujs-autoSuites.json", handlers.autoSuite );   
    app.get("/klujs-codeList.json", handlers.codeList );
    app.get( "/*.js", handlers.js );
    app.get( "/nocov", handlers.nocov );
    app.get( "/KluJS/*", klujsStatic );
    app.get( "/", handlers.vanilla );
    
    
    app.listen( port );
    util.log( "Listening on " + port );

    if ( argv.phantom ) {
        phanto.runPhantom( function( result ) {
            util.log( "Phantom result: " + result );
            process.exit(0);
        }, __dirname, port );
    }


} );