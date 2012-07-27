/*global define:false, describe:false, it:false, expect:false */
define( [ "server/LibFilter" ], function( LibFilter ) {

    describe( "LibFilter", function() {
        it( "Filters only /KluJS and require-jquery.js by default", function() {
            var topic = new LibFilter( {} );
            expect( topic.test( "foo/bar" ) ).toBe( true );
            expect( topic.test( "/javascript/lib/bar" ) ).toBe( true );
            expect( topic.test( "/KluJS/goo" ) ).toBe( false );
            expect( topic.test( "src/require-jquery.js" ) ).toBe( false );
        } );
        it( "Can suspend default filtering", function() {
            var topic = new LibFilter( { noDefaultFilter : true } );
            expect( topic.test( "/javascript/lib/bar" ) ).toBe( true );
            expect( topic.test( "/KluJS/goo" ) ).toBe( true );
        } );
        it( "Filters libDirs expressions", function() {
            var topic = new LibFilter( { libDirs: ["foo", /^w.*x$/ ] } );
            expect( topic.test( "javascript/lib/bar" ) ).toBe( true );
            expect( topic.test( "javascript/foo/bar" ) ).toBe( false );
            expect( topic.test( "foo" ) ).toBe( false );
            expect( topic.test( "/foo" ) ).toBe( false );
            expect( topic.test( "w/end/with/anx" ) ).toBe( false );
            expect( topic.test( "w/end/with/ay" ) ).toBe( true );
            expect( topic.test( "/KluJS/goo" ) ).toBe( false );
        } );
    } );

} );
