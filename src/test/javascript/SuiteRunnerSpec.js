/*global define:false, describe:false, it:false, expect:false, $:false, klujs:false, jasmine:false, runs:false, waitsFor:false */
define( [ "SuiteRunner"], function( SuiteRunner ) {

    describe( "SuiteRunner", function() {
        var topic = new SuiteRunner();
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
            expect( topic.klujsConfig ).toBe( klujs );
            topic.jasmine = mockJasmine;
            // gotcha: suite name for this test must be "Models"
            // gotcha: depends on a fixture, which must exist.
            // jasmine freaks out if is a spec here
            // although of course it generally is.
            topic.klujsConfig = {
                suites : { "Models" : [ "coverage/fixture/simple.js" ] },
                test : klujs.test
            };
            runs( function() {
                topic.go();
            });
            waitsFor( function() { return executed; }, 1000 );
            runs( function() {
                expect( executed ).toBe( true );
            } );

        } );

        
    } );
} );
