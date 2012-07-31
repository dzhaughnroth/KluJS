/*global define:false, describe:false, it:false, expect:false, $:false, runs:false, waitsFor:false */
define( [ "SuiteStarter", "jquery", "./MockJasmine.js"], function( SuiteStarter, $, MockJasmine ) {

    var mockJasmine = new MockJasmine();
    var fetcherCallback;
    var fetcherErrorCallback;
    var mockFetcher = {
        fetch : function( callback, errCallback ) {
            fetcherCallback = callback;
            fetcherErrorCallback = errCallback;
        }
    };

    describe( "SuiteStarter", function() {
        it( "Orchestrates startup", function() {
            var facade = { head : $("<div />"),
                           body : $("<div />") };
            var topic = new SuiteStarter( facade, mockJasmine, mockFetcher, {} );
            topic.start();
            expect( fetcherCallback ).toBeDefined();
            expect( fetcherErrorCallback ).toBeDefined();            
            expect( mockJasmine.executed ).toBe( false );
            fetcherCallback();
            expect( mockJasmine.executed ).toBe( true );    
            var mockError = {};
            var failed;
            topic.suitePage.fail = function(err) { failed = err; };
            fetcherErrorCallback( mockError );
            expect( failed ).toBe( mockError );
        } );

    } );

} );
