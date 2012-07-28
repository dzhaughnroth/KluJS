/*global define:false, describe:false, it:false, expect:false, $:false, klujs:false, jasmine:false, runs:false, waitsFor:false */
define( [ "SuiteRunner", "SuiteName", "Config", "ConfigFacade"], function( SuiteRunner, SuiteName, notKlujs, ConfigFacade ) {

    describe( "SuiteRunner", function() {
        var nameModel = new SuiteName.Model();
        var error;
        var errCallback = function( x ) {
            error = x;
        };
        var topic = new SuiteRunner( nameModel, errCallback );
        var executed = false;
        var mockJasmine = {
            getEnv : function() {
                return {
                    execute : function() { executed = true; }
                };
            }
        };
        it( "Invokes Jasmine", function() {
            expect( topic.jasmine ).toBe( jasmine );
            expect( topic.onReady ).toBe( $("body").ready );
            expect( topic.klujsConfig ).toBe( notKlujs );
            topic.jasmine = mockJasmine;
            // gotcha: suite name for this test must be "(base)"
            // gotcha: depends on a fixture, which must exist.

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
                expect( error ).toBeUndefined();
                executed = false;
                mockJasmine.getEnv = function() {
                    return { execute: function() { 
                        executed = true; 
                        throw "Sabotage";
                    } 
                           };
                };
                topic.go();
            } );
            waitsFor( function() { return executed; }, 1000 );
            runs( function() {
                expect( executed ).toBe( true );
                expect( error ).toBe( "Sabotage" );
                topic.errorCallback = undefined;
                error = undefined;
                topic.go();
            } );
            waitsFor( function() { return executed; }, 1000 );
            runs( function() {
                expect( error ).toBeUndefined();
            } );
        } );

        
    } );
} );
