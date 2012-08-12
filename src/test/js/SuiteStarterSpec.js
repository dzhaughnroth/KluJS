/*global define:false, describe:false, it:false, expect:false, $:false, runs:false, waitsFor:false */
define( [ "SuiteStarter", "notJQuery", "./MockJasmine.js", "ConfigFacade"], function( SuiteStarter, $, MockJasmine, ConfigFacade ) {

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
        var facade = { head : $("<div />"),
                       body : $("<div />") };
        var oldFailure;
        var mockReqJs = { 
            onError : function( err ) {
                oldFailure = err;
            }
        };
        var topic = new SuiteStarter( facade, mockJasmine, mockFetcher, mockReqJs );
        topic.start();
        it( "Orchestrates startup", function() {
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
        it( "Calls suitePage.fail on requirejs error", function() {
            expect( mockReqJs.onError ).toBe( topic.errorHandler );
            var failure;
            topic.suitePage = {
                fail:function( err ) {
                    failure = err;
                },
                assembly : {
                    name : { 
                        set : function() { }
                    },
                    deadCode: {
                        set : function() { }
                    }
                }
            };
            topic.errorHandler( "foo" );
            expect( failure.message ).toBeDefined();
            expect( failure.requireJsError ).toBe( "foo" ); 
            expect( oldFailure ).toBe( "foo" );
        } );
        it( "Does not require a previous error handler", function() {
            var anotherReqJs = {};
            var ss = new SuiteStarter( facade, mockJasmine, mockFetcher, anotherReqJs );
            var failure;
            ss.suitePage = {
                fail:function( err ) {
                    failure = err;
                }
            };
            ss.errorHandler( "foo" );
            expect( failure.message ).toBeDefined();
            expect( failure.requireJsError ).toBe( "foo" );            
        } );
        it( "Fails specifically on bad suiteName", function() {
            topic.klujsConfig = new ConfigFacade( { suites: { goo : { specs : [], targets: [] } } } );
            topic.purl = { 
                param: function() { return "notGoo"; } 
            };
            expect( function() { topic.go(); } )
                .toThrow( "There is no suite named 'notGoo' to run" );
        } );

        it( "Fails page on exception from suite runner", function() {
            var failure;
            topic.suitePage = {
                fail:function( err ) { failure = err; }
            };
            topic.go = function() {
                throw "goo";
            };            
            try {
                fetcherCallback();
            }
            catch( x ) {
                expect( x ).toBe( "goo" );
            }
            expect( failure.message ).toBeDefined();
            expect( failure.error ).toBe( "goo" );
        } );

    } );
    



} );
