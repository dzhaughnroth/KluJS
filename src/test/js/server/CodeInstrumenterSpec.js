/*global define:false, describe:false, it:false, expect:false, beforeEach:false */
define( [ "server/CodeInstrumenter" ], function( CodeInstrumenter ) {

    var someJs = [ "function() {",
                   "  return arguments;",
                   "}"].join("\n");
    var goodFs = {
        readFile: function( url, enc, callback) {
            callback( 0, someJs );
        }
    };
    var badFs = {
        readFile: function(url, enc, callback) {
            callback( 500, "Some error" );
        }
    };
    var instrString = "//INSTRUMENTED\n";
    var mockInstrument = function( url, content, options ) { 
        return { clientCode: instrString + content };
    };
    var lastArgs;
    var mockRes = { 
        send : function() {
            lastArgs = arguments;
        }
    };
    describe( "CodeInstrumenter", function() {
        beforeEach( function() { lastArgs = undefined; } );
        it( "Calls instrumenter, forward result", function() {
            var topic = new CodeInstrumenter( goodFs, "", mockInstrument, {} );            
            topic.handleRequest( { url:"foo"}, mockRes );
            expect( lastArgs[0] ).toBe( instrString + someJs );            
            expect( lastArgs[1] ).toEqual( {"Content-Type": "text/javascript"} );
        } );
        it ( "Informs on errors", function() {
            var topic = new CodeInstrumenter( badFs, "", mockInstrument, {} );
            topic.handleRequest( { url:"Foo"}, mockRes );
            expect( lastArgs[0] ).toBe( "Error while reading Foo: 500" );
            expect( lastArgs[1] ).toBe( 500 );
        } );
        
    } );

} );
