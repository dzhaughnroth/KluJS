/*global define:false, describe:false, it:false, expect:false, $:false, klujs:false, jasmine:false, runs:false, waitsFor:false */
define( [ "SuiteRunner", "SuiteName", "Config", "ConfigFacade"], function( SuiteRunner, SuiteName, notKlujs, ConfigFacade ) {

    describe( "SuiteRunner", function() {
        var nameModel = new SuiteName.Model();
        var topic = new SuiteRunner( nameModel );
        var executed = false;
        var mockJasmine = {
            getEnv : function() {
                return {
                    execute : function() { executed = true; }
                };
            }
        };
        it( "Initializes ready to go", function() {
            expect( topic.jasmine ).toBe( jasmine );
            expect( topic.onReady ).toBe( $("body").ready );
            expect( topic.klujsConfig ).toBe( notKlujs );
            topic.jasmine = mockJasmine;
            // gotcha: suite name for this test must be "Models"
            // gotcha: depends on a fixture, which must exist.
            // jasmine freaks out if is a spec here
            // although of course it generally is.

            topic.klujsConfig = new ConfigFacade( 
                {
                    main : notKlujs.main(),
                    mainPath : notKlujs.mainPath(),
                    test : notKlujs.test(),
                    suites: {
                        "(base)" : [ "coverage/fixture/simple.js" ]
                    }
                } );
            runs( function() {
                topic.go();
            });
            waitsFor( function() { return executed; }, 1000 );
            runs( function() {
                expect( executed ).toBe( true );
                expect( nameModel.get( "suiteName" ) ).toBe( "(base)" );
            } );

        } );

        
    } );
} );
