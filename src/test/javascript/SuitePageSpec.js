/*global define:false, describe:false, it:false, expect:false, klujsAssembly:false */
define( [ "SuitePage", "jquery"], function( SuitePage, $ ) {

    describe( "SuitePage", function() {
        var global = {};
        var topic = new SuitePage(undefined,undefined,global);
        it( "Exposes a global variable", function() {
            expect( topic.assembly ).toBe( global.klujsAssembly );
        } );
        it( "Uses html body, head by default", function() {            
            expect( topic.head.get(0).tagName ).toEqual( "HEAD" );
            expect( topic.body.get(0).tagName ).toEqual( "BODY" );
        } );
        it( "Adds link elements to head", function() {
            topic = new SuitePage( $("<div />"), $("<div />" ), global );
            topic.buildDom();
            expect( topic.head.children("link").length ).toBe( 3 );
        } );
        it( "Adds divs to body", function() {
            expect( topic.body.children("div").length ).toBe( 1 );
//            console.log( topic.body );
        } );

        
    } );
} );
