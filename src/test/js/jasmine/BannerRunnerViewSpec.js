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

            mockJasmine.applyMockResults( mockRunner, 1, 1 );

            model.set("done", true );
            expect( view.$el.hasClass( "failed" ) ).toBe( true );
            expect( view.textEl.text() ).toBe( "Jasmine: 1 of 2 specs failed (1 skipped)" );

            mockJasmine.applyMockResults( mockRunner, 0, 0 );
            model.set("done", false );
            model.set("done", true );
            expect( view.$el.hasClass( "passed" ) ).toBe( true );
            expect( view.textEl.text() ).toBe( "Jasmine: 3 specs passed" );
            expect( view.$el.hasClass( "hasSkips" ) ).toBe( false );

            mockJasmine.applyMockResults( mockRunner, 1, 0 );
            model.set("done", false );
            model.set("done", true );
            expect( view.$el.hasClass( "passed" ) ).toBe( true );
            expect( view.$el.hasClass( "hasSkips" ) ).toBe( true );
            expect( view.textEl.text() ).toBe( "Jasmine: 2 specs passed (1 skipped)" );

        } );
    } );

                

} );
