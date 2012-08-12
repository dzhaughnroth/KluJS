/*global define:false, describe:false, it:false, expect:false */

/* This exercises all but one detected branch of uncovered.  Can be run
 from the same directory, or from another, with different results
 */
define( [ "cov/Uncovered" ], function( Uncovered ) {

    describe( "Uncovered", function() {
        var topic = new Uncovered();
        it( "Should test stuff", function() {
            // by rights, this should one of two branches; but
            // the node-coverage package is not at that level yet;
            expect( topic.echoic() ).toBe( "default" ); 
            expect( topic.branch( false ) ).toBe( false );
            expect( topic.branch( true ) ).toBe( true );
            expect( topic.trinary( false ) ).toBe( "no" );            
        } );

    } );
});
