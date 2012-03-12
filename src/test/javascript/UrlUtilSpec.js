/*globals define:false, describe:false, it:false, expect:false */
define( ["KluJS/urlUtil"], function( parser ) {
    describe( "The Relative Url Parser", function() {
        var a = "http://oops.com/top/mid/A/AA/a.html";
        var aTwo = "http://oops.com/top/mid/A/AA/aTwo.html";
        var aToATwo = "aTwo.html";
        var b = "http://oops.com/top/mid/B/b.html";
        var aToB = "../../B/b.html";
        var bToA = "../A/AA/a.html";
        var bToA2 = "..//A//AA/a.html";
        var c = "http://oops.com/top/mid/B/C/c.html";
        var bToC = "C/c.html";
        var cToB = "../b.html";
        var c2 = "http://oops.com/top/mid//B//C/c.html";
        it ( "Should find relative paths", function() {           
            expect( parser.relative( a, b ) ).toEqual( aToB );
            expect( parser.relative( b, a ) ).toEqual( bToA );
        } );
        it( "Should find absolute paths", function() {
            expect( parser.absolute( a, aToB ) ).toEqual( b );
            expect( parser.absolute( b, bToA ) ).toEqual( a );
            expect( parser.absolute( a, aToATwo ) ).toEqual( aTwo );
        } );
        it( "Should handle case where one is below other", function() {
            expect( parser.relative( b, c ) ).toEqual( bToC );
            expect( parser.relative( c, b ) ).toEqual( cToB );
         } );
        it( "Should handle empty cases", function() {
            expect( parser.relative( a, aTwo ) ).toEqual( aToATwo );
        } );
        it( "Should handle double slash", function() {
            expect( parser.absolute( b, bToA2 ) ).toEqual( a );
            expect( parser.relative( b, c2 ) ).toEqual( bToC );
        } );
        it( "Should find tags", function() {
            var tags = parser.findScriptTags( /UrlUtilSpec.js$/ );
            var srcs = parser.findSrcsForScriptTags( /UrlUtilSpec.js$/ );
            var nada = parser.findSrcsForScriptTags( /UrlUtilSpectacles.js$/ );
            expect( tags.length ).toBe( 1 );
            expect( srcs.length ).toBe( 1 );
            expect( srcs[0] ).toMatch( /UrlUtilSpec.js$/ );
            expect( nada.length ).toBe( 0 );
        } );
    } );
} );

