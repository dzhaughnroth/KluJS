define( ["One"], function( One ) {
    describe( "AnotherOne", function() {
        var topic = new One( [1,2,3,4,5,6,7] );
        it( "Computes evens", function() {
            waits( 1000 );
            runs( function() {
                expect( topic.ints ).toEqual( [1,2,3,4,5,6,7] );
                expect( topic.evens() ).toEqual( [2,4,6] );
            } );
        } );
    } );

});