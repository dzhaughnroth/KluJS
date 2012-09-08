/*global define:false, describe:false, it:false, expect:false, runs:false, waitsFor:false, waits:false */
define( [ "jasmine/BlinkyRunnerView", "jasmine/RunnerModel", "notUnderscore", "notJQuery", "./MockJasmine.js" ], function( BlinkyRunnerView, RunnerModel, _, $, MockJasmine ) {

    var mockJasmine = new MockJasmine();
    var mockRunner = mockJasmine.standardRunner();
    describe( "RunnerBlinkyView", function() {
        var model = new RunnerModel();
        var view = new BlinkyRunnerView( { model : model } ).render();
        it( "renders initially empty", function() {
            expect( view.$el.children().length ).toBe( 2 );
            $("body").append( view.$el );
            expect( $(view.$el.children( "div" )[1]).text() ).toBe( "...loading..." );
        } );
        it ( "Renders subviews for specs", function() {
            model.set("runner", mockRunner );
            expect( view.$el.find( "span" ).length ).toBe( 3 );
        } );
        it( "Wires hover event handler", function() {
            $( view.$el.find( "span" )[0] ).mouseenter();
            expect( view.nameEl.text() ).toBe( "spec1" );
            $( view.$el.find( "span" )[1] ).mouseenter();
            expect( view.nameEl.text() ).toBe( "spec2" );
        } );

    } );

                

} );
