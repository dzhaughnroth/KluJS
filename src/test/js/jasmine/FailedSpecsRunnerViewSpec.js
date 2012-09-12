/*global define:false, describe:false, it:false, expect:false, runs:false, waitsFor:false, waits:false, beforeEach:false */
define( [ "jasmine/FailedSpecsRunnerView", "jasmine/RunnerModel", "notUnderscore", "notJQuery", "./MockJasmine.js" ], function( FailedSpecsRunnerView, RunnerModel, _, $, MockJasmine ) {

    var mockJasmine = new MockJasmine();
    var mockRunner = mockJasmine.standardRunner();
    describe( "FailedSpecsRunnerView", function() {       
        var model;
        var view;
        beforeEach( function() {
            model = new RunnerModel();
            view = new FailedSpecsRunnerView( { model : model } ).render();
        } );
        it( "renders initially empty, ignores running, passed states", function() {
            expect( view.$el.children().length ).toBe( 0 );
            model.set("runner", mockRunner );
            expect( view.$el.children().length ).toBe( 0 );
            mockJasmine.applyMockResults( mockRunner, 0, 0);
            model.set("done", true );
            expect( view.$el.children().length ).toBe( 0 );
        } );
        it ( "Shows failures, hides passed and skipped", function() {            
            model.set("runner", mockRunner );            
            mockJasmine.applyMockResults( mockRunner, 0, 1);
//            mockRunner.mockResults = mockJasmine.makeMockResults( 10, 2 );
            mockRunner.mockSuites[0].mockSpecs[0].mockResults = mockJasmine.makeMockResults( 2, 1 );
            mockRunner.mockSuites[0].mockSpecs[0].mockResults.skipped = true;
            mockRunner.mockSuites[0].mockSuites[0].mockSpecs[0].mockResults = mockJasmine.makeMockResults( 5, 2 );
            mockRunner.mockSuites[0].mockSuites[0].mockSpecs[1].mockResults = mockJasmine.makeMockResults( 2, 0 );
            $.each( model.specMap, function( id, mod ) { mod.set("done", true ); } );

            model.set("done", true );
            $("body").append( $("<p/>", {text:"goo"} ) );
            $("body").append( view.$el );
            expect( view.$el.find( ".jasmineFailedSpecView" ).length ).toBe( 1 );
        } );

    } );

                

} );
