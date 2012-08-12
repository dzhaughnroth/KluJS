/*globals define:false */
define( [ ], function( ) {

    // Parameters for mocking:
    // fs is usual node fs; mockable; we use readFile( url, encoding, callback );
    // instrument is from node-coverage instrument package, 
    // we use instrument( url, code, coverageOptions)

    var CodeInstrumenter = function( fs, docRoot, instrument, coverageOptions ) {

        var withInstrumentedCode = function( url, callback, errorCallback ) {
		        fs.readFile( docRoot + url, "utf-8", function (err, content) {
			        if (err) {
				        errorCallback( err, url );
			        } else {                        
				        var code = instrument(url, content, coverageOptions);
				        callback( code.clientCode, url );
                    }
                } );


        };

        var handleRequest = function( req, res ) {            
            withInstrumentedCode( req.url, function( code ) {
                res.send( code, { "Content-Type" : "text/javascript" } );
            }, function( err ) {
                res.send("Error while reading " + req.url + ": " + err, 500);
            } );
        };

        this.handleRequest = handleRequest;
    };
    
    return CodeInstrumenter;
} );