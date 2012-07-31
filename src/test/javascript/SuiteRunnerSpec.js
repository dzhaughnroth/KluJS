/*global define:false, describe:false, it:false, expect:false, $:false, klujs:false, runs:false, waitsFor:false */
define( [ "SuiteRunner", "SuiteName", "Config", "ConfigFacade", "./MockJasmine.js" ], function( SuiteRunner, SuiteName, notKlujs, ConfigFacade, MockJasmine ) {

    describe( "SuiteRunner", function() {
        var nameModel = new SuiteName.Model();
        var error;
        var errCallback = function( x ) {
            error = x;
        };
            
        var mockJasmine = new MockJasmine();

        var topic = new SuiteRunner( nameModel, errCallback, mockJasmine );
        it( "Invokes Jasmine", function() {
            runs( function() {
                expect( topic.jasmine ).toBe( mockJasmine );
                expect( topic.klujsConfig ).toBe( notKlujs );
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
                    topic.go();                    
                }
                catch( x ) {
                    throw x;
                }
            });
            waitsFor( function() { return mockJasmine.executed; }, 200 );
            runs( function() {
                expect( mockJasmine.executed ).toBe( true );
                expect( error ).toBeUndefined();
                mockJasmine.executed = false;
                mockJasmine.getEnv = function() {
                    return { execute: function() { 
                        mockJasmine.executed = true; 
                        throw "Sabotage";
                    } 
                           };
                };
                topic.go();
            } );
            waitsFor( function() { return mockJasmine.executed; }, 200 );
            runs( function() {
                expect( mockJasmine.executed ).toBe( true );
                expect( error ).toBe( "Sabotage" );
                topic.errorCallback = undefined;
                error = undefined;
                topic.go();
 //               readyCallback();
            } );
            waitsFor( function() { return mockJasmine.executed; }, 200 );
            runs( function() {
                expect( error ).toBeUndefined();
            } );
        } );

        
    } );
} );
