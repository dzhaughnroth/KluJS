/*globals define:false */
define( [ "jquery", "require", "./Config" ], function( $, require, notKlujs ) {

    var SuiteRunner = function( nameModel, errorCallback, jasmineImpl, purl ) {
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
            var suite = purl.param("suite");
            nameModel.set("suiteName", suite );
            var relSpecs = [];
            var prefix = self.klujsConfig.test();
            if ( ! self.klujsConfig.specsForSuite( suite ) ) {
                throw( "There is no suite named '" + suite + "' to run");
            }
            $.each( self.klujsConfig.specsForSuite(suite), function( i, spec ) {
                var pathToSpec = prefix + "/" + spec;
                relSpecs.push( pathToSpec );
            });
            self.runSpecs( relSpecs );
        };        
    };
    return SuiteRunner;

} );
