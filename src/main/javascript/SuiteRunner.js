/*globals define:false, klujs:false, jasmine:false */
define( [ "jquery", "require", "./lib/purl" ], function( $, require, purl ) {

    // args optional, for mocking.
    var SuiteRunner = function( ) {
        var self = this;
        this.klujsConfig = klujs;
        this.onReady = $("body").ready;
        this.jasmine = jasmine;
        this.runSpecs = function( specs ) {
            require( specs, function() {
                self.jasmine.getEnv().execute();
            } );
        };

        this.go = function() {
            self.onReady( function() {
                var suite = purl().param("suite");
                var relSpecs = [];
                $.each( self.klujsConfig.suites[suite], function( i, spec ) {
                    relSpecs.push( "../" + self.klujsConfig.test + "/" + spec );
                });
                self.runSpecs( relSpecs );
            } );
        };        
    };
    return SuiteRunner;

} );
