/*global define:false, describe:false, it:false, expect:false */
define( ["Base", "./lib/TestLib.js"], function(Base, TestLib) {

    describe( "Base", function() {
        var topic = new Base();
        it( "Should be base", function() {
            expect( TestLib.checkBase( topic ) ).toBe( true );
        } );
    } );
});