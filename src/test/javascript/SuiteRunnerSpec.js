/*global define:false, describe:false, it:false, expect:false, $:false, klujs:false, jasmine:false, runs:false, waitsFor:false */
define( [ "SuiteRunner", "SuiteName", "Config", "ConfigFacade"], function( SuiteRunner, SuiteName, notKlujs, ConfigFacade ) {

    describe( "SuiteRunner", function() {
        var nameModel = new SuiteName.Model();
        var error;
        var errCallback = function( x ) {
            error = x;
        };
//        var readyCallback;
//        var readyMethod = function(x) {
//            readyCallback = x;
//        };
            
        var topic = new SuiteRunner( nameModel, errCallback );//, readyMethod );
        var executed = false;
        var mockJasmine = {
            getEnv : function() {
                return {
                    execute : function() { executed = true; }
                };
            }
        };
        it( "Invokes Jasmine", function() {
            runs( function() {
                expect( topic.jasmine ).toBe( jasmine );
//                expect( topic.ready ).toBe( readyMethod );//$("body").ready );
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
                try {
//                    expect( readyCallback ).toBeUndefined();
                    topic.go();                    
//                    expect( readyCallback ).toBeDefined();
//                    readyCallback();
                }
                catch( x ) {
                    throw x;
                }
            });
            waitsFor( function() { return executed; }, 200 );
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
 //               readyCallback();
            } );
            waitsFor( function() { return executed; }, 200 );
            runs( function() {
                expect( executed ).toBe( true );
                expect( error ).toBe( "Sabotage" );
                topic.errorCallback = undefined;
                error = undefined;
                topic.go();
 //               readyCallback();
            } );
            waitsFor( function() { return executed; }, 200 );
            runs( function() {
                expect( error ).toBeUndefined();
            } );
        } );

        
    } );
} );
