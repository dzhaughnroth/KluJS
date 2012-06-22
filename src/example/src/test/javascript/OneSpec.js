/*global define:false, describe:false, it:false, expect:false */
define( ["One"], function( One ) {
    describe( "One", function() {
        var topic = new One( [1,2,3,4,5,6,7,8] );
        it( "Computes evens", function() {
            expect( topic.ints ).toEqual( [1,2,3,4,5,6,7,8] );
            expect( topic.evens() ).toEqual( [2,4,6,8] );
        } );
    } );

});