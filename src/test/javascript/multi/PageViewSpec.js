/*global define:false, describe:false, it:false, expect:false */
define( [ "multi/PageView", "multi/PageModel", "notJQuery", "ConfigFacade" ], function( PageView, PageModel, $, ConfigFacade ) {

    describe( "PageView", function() {
        var config = new ConfigFacade( {
            suites: {
                Foo: ["foospec", "foofoospec"],
                Bar: ["barspec"]
            }
        } );
        var frameDiv = $("<div />");
        var model = new PageModel( { 
            config: config,
            frameDiv: frameDiv
        } );
        var topic = new PageView( { model: model } );
        var head = $("<div />" );
        var body = $("<div />" );        
        it( "Configures with jquery head, body by default", function() {
            expect( topic.headElement ).toEqual( $("head") );
            expect( topic.bodyElement ).toEqual( $("body") );
            topic.headElement = head;
            topic.bodyElement = body;
            topic.render();
        } );
        it( "Should add css links to html head", function() {
            expect( head.children( "link" ).length ).toBe( 3 );            
        } );
        it( "Should add stuff to html body", function() {
            expect( body.find( "div.childFrameContainer" ).length ).toBe( 1 );
            expect( body.find( "div.lintCollectionView" ).length ).toBe( 1 );
            expect( body.find( "div.coverageDataView" ).length ).toBe( 1 );
            expect( body.find( "div.deadCodeView" ).length ).toBe( 1 );
            expect( frameDiv.find( "iframe" ).length ).toBe( 2 );
        } );
        it( "Does not reintroduce elements", function() {
            topic.render();
            expect( head.children( "link" ).length ).toBe( 3 );            
            expect( body.find( "div.childFrameContainer" ).length ).toBe( 1 );            
        } );


    } );


} );
