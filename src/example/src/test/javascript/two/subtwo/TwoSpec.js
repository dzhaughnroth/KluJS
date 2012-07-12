define( ["Two"], function( Two ) {
    describe( "AnotherTestTwo", function() {
        it( "Is 2", function() {
            expect( Two.value ).toBe( 2 );
        } );
        it( "Does not know about _ or Backbone", function() {
            expect( Backbone ).toBeUndefined();
            expect( _ ).toBeUndefined();
        } );
    } );

});