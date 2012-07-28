/*globals define:false, klujs:false, jasmine:false */
define( [ "jquery", "require", "./lib/purl", "./Config" ], function( $, require, purl, notKlujs ) {

    var SuiteRunner = function( nameModel, errorCallback ) {
        var self = this;
        this.errorCallback = errorCallback;
        this.klujsConfig = notKlujs;
        this.onReady = $("body").ready;
        this.jasmine = jasmine;
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
            self.onReady( function() {
                var suite = purl().param("suite");
                nameModel.set("suiteName", suite );
                var relSpecs = [];
                var prefix = self.klujsConfig.test();
                $.each( self.klujsConfig.specsForSuite(suite), function( i, spec ) {
                    var pathToSpec = prefix + "/" + spec;
                    relSpecs.push( pathToSpec );
                });
                self.runSpecs( relSpecs );
            } );
        };        
    };
    return SuiteRunner;

} );
