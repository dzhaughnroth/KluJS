/*global define:false, describe:false, it:false, expect:false */

/* This exercises just one branch of uncovered.  Can be run
 from the same directory, or from another, with different results
 */
define( [ "cov/Uncovered" ], function( Uncovered ) {

    describe( "Uncovered", function() {
        var topic = new Uncovered();
        it( "Should test stuff", function() {
            expect( topic.trinary( true ) ).toBe( "yes" );
        } );

    } );
});
