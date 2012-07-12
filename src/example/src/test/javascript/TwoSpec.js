define( ["Two"], function( Two ) {
    describe( "Two", function() {
        it( "Is 2", function() {
            expect( Two ).toBe( 2 ); // intentional failure; Two.value === 2
        } );
    } );

});