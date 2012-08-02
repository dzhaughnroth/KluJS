/*global define:false, describe:false, it:false, expect:false, beforeEach:false */
define( [ "server/Handlers" ], function( Handlers ) {


    describe( "Handlers", function() {
        var last;
        var lastCookie;
        var mockRes = { 
            send : function() {
                last = arguments;
            },
            cookie : function() {
                lastCookie = arguments;
            }
            
        };
        var nextCalled = false;
        var next = function() {
            nextCalled = true;
        };
        var cookies = {};
        var mockReq = {};
        mockReq.cookies = function() {
            return cookies;
        };
        mockReq.query = {};
        
        beforeEach( function() { last = undefined; nextCalled = false;} );
        describe( "Vanilla", function() {
            var topic = new Handlers();
            it( "Always writes html to response", function() {
                topic.vanilla( mockReq, mockRes, undefined );
                expect( last[0] ).toEqual( topic.vanillaResponse );
                expect( last[1] ).toEqual( {"Content-Type":"text/html"} );
                expect( lastCookie ).toEqual( { 0 : "klujs-instrument", 1:"true" } );
            } );
        } );
        describe( "Nocov", function() {
            var topic = new Handlers();
            it( "Always writes html to response", function() {
                topic.nocov( mockReq, mockRes, undefined );
                expect( last[0] ).toEqual( topic.vanillaResponse );
                expect( last[1] ).toEqual( {"Content-Type":"text/html"} );
                expect( lastCookie ).toEqual( { 0 : "klujs-instrument", 1:"false" } );
            } );
        } );
        describe( "autoSuite", function() {
            var topic = new Handlers( { getAsString: function() { return "foo";} } );
            it( "Should return what SuiteManager says", function() {
                topic.autoSuite( mockReq, mockRes, undefined );
                expect( last[0] ).toEqual( "foo" );
                expect( last[1] ).toEqual( {"Content-Type":"text/javascript"} );                
            } );
        } );
        describe( "js handler", function() {
            var mockLibFilterVal = true;
            var reqHandled = false;
            var topic = new Handlers( mockReq, 
                                      { test : function() { return mockLibFilterVal; } },
                                      { handleRequest : function() { reqHandled = true; } },
                                      undefined );

            beforeEach( function() { reqHandled = false; } );
            it( "Should delegate to next on special parameter value", function() {
                mockReq.query.KluJSplain = "x";
                topic.js( mockReq, mockRes, next );
                expect( nextCalled ).toBe( true );
                expect( reqHandled ).toBe( false );
            } );
            it( "Should delegate to next if libFilter says", function() {               
                nextCalled = false;
                mockLibFilterVal = false;
                mockReq.query.KluJSplain = undefined;
                topic.js( mockReq, mockRes, next );
                expect( nextCalled ).toBe( true );
                expect( reqHandled ).toBe( false );
            } );
            it( "Should delegate to next if cookies is set", function() {
                nextCalled = false;
                mockReq.cookies["klujs-instrument"] = "false";
                topic.js( mockReq, mockReq, next );
                expect( nextCalled ).toBe( true );
                expect( reqHandled ).toBe( false );
            } );
            it( "Should delegate to codeInstrumenter otherwise", function() {
                mockLibFilterVal = true;
                mockReq.cookies = {};
                topic.js( mockReq, mockRes, next );
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
