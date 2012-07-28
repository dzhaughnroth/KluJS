/*global define:false, describe:false, it:false, expect:false, beforeEach:false */
define( [ "server/Handlers" ], function( Handlers ) {


    describe( "Handlers", function() {
        var last;
        var mockRes = { 
            send : function() {
                last = arguments;
            } 
        };
        var nextCalled = false;
        var next = function() {
            nextCalled = true;
        };
        beforeEach( function() { last = undefined; nextCalled = false;} );
        describe( "Vanilla", function() {
            var topic = new Handlers();

            it( "Always writes html to response", function() {
                topic.vanilla( undefined, mockRes, undefined );
                expect( last[0] ).toEqual( topic.vanillaResponse );
                expect( last[1] ).toEqual( {"Content-Type":"text/html"} );
            } );
        } );
        describe( "autoSuite", function() {
            var topic = new Handlers( { getAsString: function() { return "foo";} } );
            it( "Should return what SuiteManager says", function() {
                topic.autoSuite( undefined, mockRes, undefined );
                expect( last[0] ).toEqual( "foo" );
                expect( last[1] ).toEqual( {"Content-Type":"text/javascript"} );                
            } );
        } );
        describe( "js handler", function() {
            var mockLibFilterVal = true;
            var reqHandled = false;
            var topic = new Handlers( undefined, 
                                      { test : function() { return mockLibFilterVal; } },
                                      { handleRequest : function() { reqHandled = true; } },
                                      undefined );

            beforeEach( function() { reqHandled = false; } );
            it( "Should delegate to next on special parameter value", function() {
                topic.js( { query : { KluJSplain : "x" } }, mockRes, next );
                expect( nextCalled ).toBe( true );
                expect( reqHandled ).toBe( false );
            } );
            it( "Should delegate to next if libFilter says", function() {               
                mockLibFilterVal = false;
                topic.js( { query : { } }, mockRes, next );
                expect( nextCalled ).toBe( true );
                expect( reqHandled ).toBe( false );
            } );
            it( "Should delegate to codeInstrumenter otherwise", function() {
                mockLibFilterVal = true;
                topic.js( { query : { } }, mockRes, next );
                expect( nextCalled ).toBe( false );
                expect( reqHandled ).toBe( true );
            } );
        } );
        describe( "Code finder", function() {
            var MockFilter = function() {
                var count = 0;
                this.test = function() {
                    return count++ < 2;
                };
            };
            var topic = new Handlers( undefined, new MockFilter(), undefined, 
                                      { find: function() {return this;},
                                        found: ["Foo", "bar", "baz", "bill"] 
                                      } );
            it( "Should send filtered code list as string", function() {
                topic.codeList( undefined, mockRes, next );
                expect( last[0] ).toBe( JSON.stringify( ["Foo", "bar"] ));
                expect( last[1] ).toEqual( {"Content-Type":"text/javascript"} );                
            } );
        } );
    } );

} );
