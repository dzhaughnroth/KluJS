/*global define:false, describe:false, it:false, expect:false, runs:false, waitsFor:false, waits:false */
define( [ "jasmine/CompositeRunnerView", "jasmine/RunnerModel", "notUnderscore", "notJQuery", "./MockJasmine.js" ], function( CompositeRunnerView, RunnerModel, _, $, MockJasmine ) {

//    var mockJasmine = new MockJasmine();
//    var mockRunner = mockJasmine.standardRunner();
    describe( "CompositeRunnerView", function() {       
        var model;
        var view;
        model = new RunnerModel();
        view = new CompositeRunnerView( { model : model } ).render();
        it( "Has child views", function() {
            var chillen = view.$el.children();
            var expected = [ view.bannerView, view.blinkyView, 
                             view.failView, view.treeView ];
            var i;
            for( i = 0; i < chillen.length; i++ ) {
                expect( $(chillen[i]) ).toEqual( expected[i].$el );
            }
        } );
        it( "Toggles treeView", function() {
            expect( view.treeView.$el.hasClass( "hidden" ) ).toBe( true );
            view.bannerView.showAllModel.set( "checked", true );
            expect( view.treeView.$el.hasClass( "hidden" ) ).toBe( false );
            view.bannerView.showAllModel.set( "checked", false );
            expect( view.treeView.$el.hasClass( "hidden" ) ).toBe( true );
        } );

    } );

                

} );
