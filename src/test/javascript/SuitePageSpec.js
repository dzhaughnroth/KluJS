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
            var head = $("<div />");
            topic = new SuitePage( head, $("<div />" ), global );
            topic.buildDom();
            expect( head.children("link").length ).toBe( 3 );
        } );
        it( "Adds div to body", function() {
            expect( $.contains( topic.body, topic.view.$el ) );
            expect( topic.body.children("div").length ).toBe( 1 );
        } );

        
    } );
} );
