/*global defin:false, describe:false, it:false, expect:false*/
define( ["bModule"], function( bMod ) {
    describe( "Something", function() {
        it( "should ring true", function() {
            expect( bMod.inc( 3 ) ).toBe( 4 );
        } );
    });
});