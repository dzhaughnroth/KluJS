/*global define:false, describe:false, it:false, expect:false, runs:false, waitsFor:false, waits:false */
define( [ "jasmine/BannerRunnerView", "jasmine/RunnerModel", "notUnderscore", "notJQuery", "./MockJasmine.js" ], function( BannerRunnerView, RunnerModel, _, $, MockJasmine ) {

    var mockJasmine = new MockJasmine();
    var mockRunner = mockJasmine.standardRunner();
    describe( "BannerRunnerView", function() {
        var model = new RunnerModel();
        var view = new BannerRunnerView( { model : model } ).render();
        it( "is initially empty", function() {
            expect( view.textEl.text() ).toBe( "Jasmine: Loading" );
        } );
        it ( "Tracks status", function() {
            model.set("runner", mockRunner );
            expect( view.$el.hasClass( "running" ) ).toBe( true );
            expect( view.textEl.text() ).toBe( "Jasmine: Running 3 specs" );

            mockRunner.mockResults = mockJasmine.makeMockResults( 10, 2 );
            model.set("done", true );
            expect( view.$el.hasClass( "failed" ) ).toBe( true );
            expect( view.textEl.text() ).toBe( "Jasmine: 2 of 3 specs failed" );

            mockRunner.mockResults = mockJasmine.makeMockResults( 10, 0 );
            model.set("done", false );
            model.set("done", true );
            expect( view.$el.hasClass( "passed" ) ).toBe( true );
            expect( view.textEl.text() ).toBe( "Jasmine: All 3 specs passed" );
        } );
    } );

                

} );
