/*global define:false, describe:false, it:false, expect:false, runs:false, waitsFor:false, waits:false */
define( [ "jasmine/TreeRunnerView", "jasmine/RunnerModel", "notUnderscore", "notJQuery", "./MockJasmine.js" ], function( TreeRunnerView, RunnerModel, _, $, MockJasmine ) {

    var mockJasmine = new MockJasmine();
    var mockRunner = mockJasmine.standardRunner();
    describe( "TreeRunnerView", function() {
        var model = new RunnerModel();
        var view = new TreeRunnerView( { model : model } ).render();
        it( "renders initially empty", function() {
            expect( view.$el.children().length ).toBe( 0 );
//            expect( 1 ).toBe( 2 );
        } );
        it ( "Contains suite views", function() {
            model.set("runner", mockRunner );
            expect( view.$el.children( ).length ).toBe( 1 );            
            expect( view.$el.find( ".jasmineSuiteView" ).length ).toBe( 2 );
            expect( view.$el.find( ".jasmineSpecView" ).length ).toBe( 3 );
            view.render();
            // doesn't rerender.
            expect( view.$el.children( ).length ).toBe( 1 );
            expect( view.$el.find( ".jasmineSuiteView" ).length ).toBe( 2 );
        } );

    } );

                

} );
