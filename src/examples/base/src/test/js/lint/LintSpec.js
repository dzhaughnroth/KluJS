/*global define:false, describe:false, it:false, expect:false */

/* Note how the .js suffix on TestLib causes the module from the
 test/js tree; Note also how the full path from requirejs to main/js
 module Fine required.
 */
define( [ ], function( ) {

    describe( "Every main and test file should be Linted!", function() {
        var unused = "Unused I know";
        it( "Should be base", function() {
            expect( true).toBe( true );
        } );

    } );
});
