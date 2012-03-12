define( ["aModule", "./testModule.js"], function( aMod, tMod ) {
    describe( "The A module", function() {
        it( "should add", function() {
            expect( aMod.add( 2, 1, 3, -5 ) ).toBe( 1 );
        } );
        it( "should echo", function() {
            expect( tMod.echo( 21 ) ).toBe( 21 );
            var z = [1,2];
            expect( tMod.echo( z ) ).toBe( z );
        });
    });
});
