/*global define:false, describe:false, it:false, expect:false, klujsAssembly:false */
define( [ "SuitePage", "HtmlPageFacade", "jquery", "./MockJasmine.js"], function( SuitePage, HtmlPageFacade, $, MockJasmine ) {

    describe( "SuitePage", function() {
        var global = {};
        var mockJasmine = new MockJasmine();
        var topic = new SuitePage( new HtmlPageFacade(), global, mockJasmine);
        it( "Exposes a global variable", function() {
            expect( topic.assembly ).toBe( global.klujsAssembly );
        } );
        it( "Uses html body, head by default", function() {            
            expect( topic.pageFacade.head.get(0).tagName ).toEqual( "HEAD" );
            expect( topic.pageFacade.body.get(0).tagName ).toEqual( "BODY" );
        } );
        it( "Adds link elements to head", function() {
            var facade = new HtmlPageFacade( $("<div />"), $("<div />"), function(){} );
            topic = new SuitePage( facade, global, mockJasmine );
            topic.buildDom();
            expect( facade.head.children("link").length ).toBe( 3 );
        } );
        it( "Adds div to body", function() {
            expect( $.contains( topic.pageFacade.body, topic.view.$el ) );
            expect( topic.pageFacade.body.children("div").length ).toBe( 1 );
        } );
        it( "Has failure dispay", function() {
            $("body").append( topic.pageFacade.body );
            topic.fail( { whoops: "eeDaisy" } );
            var headline = $(topic.pageFacade.body.find( ".klujsFailureHeadline" ));
            expect( headline.text() ).toBe( "Error: KluJS did not work" );
            var pre = $(topic.pageFacade.body.find( ".klujsFailureText" ));
            expect( pre.text() ).toMatch( "whoops.*eeDaisy" );
        } );
        
    } );
} );
