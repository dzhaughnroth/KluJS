/*globals define:false */
define( [ "jquery", "require", "./lib/purl", "./Config" ], function( $, require, purl, notKlujs ) {

    var SuiteRunner = function( nameModel, errorCallback, jasmineImpl ) {
        var self = this;
        this.errorCallback = errorCallback;
        this.klujsConfig = notKlujs;
        this.jasmine = jasmineImpl;
        this.runSpecs = function( specs ) {
            require( specs, function() {
                try {
                    self.jasmine.getEnv().execute();
                }
                catch( x ) {
                    if ( self.errorCallback ) {
                        self.errorCallback( x );
                    }
                }
            } );
        };

        this.go = function() {
            
            var suite = purl().param("suite");
            nameModel.set("suiteName", suite );
            var relSpecs = [];
            var prefix = self.klujsConfig.test();
            $.each( self.klujsConfig.specsForSuite(suite), function( i, spec ) {
                var pathToSpec = prefix + "/" + spec;
                relSpecs.push( pathToSpec );
            });
            self.runSpecs( relSpecs );
        };        
    };
    return SuiteRunner;

} );
