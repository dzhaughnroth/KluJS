define( ["Two"], function( Two ) {
    describe( "AnotherOne", function() {
        it( "Is 2", function() {
            expect( Two ).toBe( 2 );
        } );
        it( "Does not know about _ or Backbone", function() {
            expect( Backbone ).toBeUndefined();
            expect( _ ).toBeUndefined();

        } );
    } );

});