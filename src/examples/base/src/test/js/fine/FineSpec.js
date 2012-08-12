/*global define:false, describe:false, it:false, expect:false */

/* Note how the .js suffix on TestLib causes the module from the
 test/js tree; Note also how the full path from requirejs to main/js
 module Fine required.
 */
define( ["fine/Fine", "../lib/TestLib.js"], function(Fine, TestLib ) {

    describe( "Fine", function() {
        var topic = new Fine();
        it( "Should be base", function() {
            expect( topic.fine ).toBe( true );
            expect( topic.isFine() ).toBe( true );
            expect( topic.common.GlobalValue ).toBe( "GlobalValuea" );
        } );
    } );
});
