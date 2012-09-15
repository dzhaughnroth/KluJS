/*global define:false, describe:false, it:false, expect:false, runs:false, waitsFor:false, waits:false */
define( [ "jasmine/FailedSpecView", "jasmine/SpecModel", "./MockJasmine.js", "notJQuery" ], function( FailedSpecView, SpecModel, MockJasmine, $ ) {

    var mockJasmine = new MockJasmine();
    var mockSuite = mockJasmine.standardSuite();
    var mockSpec = mockSuite.mockSpecs[0];
    mockSpec.suite = mockSuite;

    describe( "FailedSpecView", function() {
        var model = new SpecModel();        
        model.fullDescription = function() { return "Faked"; };
        var view = new FailedSpecView( { model : model } ).render();
        it( "Initially empty", function() {
//            expect( view.titleEl.text() ).toBe( "Faked" );
            expect( view.$el.attr("class") ).toBe( "jasmineFailedSpecView" );

        } );
        it( "Displays spec description", function() {
            model.set( "spec", mockSpec );
            expect( view.titleEl.text() ).toBe( "suite5spec1" );
//            expect( 2 ).toBe( "foo" );
            expect( view.$el.attr("class") ).toBe( "jasmineFailedSpecView" );
        } );        
        it( "Displays an error in response to nonsense", function() {
            model.set( "done", true );            
            expect( view.titleEl.text() ).toBe( "suite5spec1: error" );
            expect( view.$el.hasClass( "error" ) ).toBe( true );
        } );
        it( "Displays pass/fail details", function() {
            mockSpec.mockResults = mockJasmine.makeMockResults( 10, 1 );
            model.set( "done", false );
            model.set( "done", true );
            expect( view.titleEl.text() ).toBe( "suite5spec1: 1/10 failed" );
            expect( view.$el.hasClass( "hidden" ) ).toBe( false ); //autohide.
            expect( view.$el.hasClass( "failed" ) ).toBe( true );

            mockSpec.mockResults = mockJasmine.makeMockResults( 10, 0 );
            model.set( "done", false );
            model.set( "done", true );
            expect( view.$el.hasClass( "passed" ) ).toBe( true );
            expect( view.titleEl.text() ).toBe( "suite5spec1: passed" );
        } );
        it ( "Supports toggling of showing passed details", function() {
            model = new SpecModel();
            view = new FailedSpecView( { model:model } );
            view.toggleShowPassed();
            view.autoHide = true;
            view.render();
            mockSpec.mockResults = mockJasmine.makeMockResults( 10, 2 );            
            model.set( "spec", mockSpec );
            model.set( "done", true );            
            $("body").append( view.$el );
            expect( view.detailEl.find( ".detailItem.hidden" ).length ).toBe( 0 );
            expect( view.$el.find( ".detailItem:not(.hidden)" ).length ).toBe( 10 );
            view.toggleShowPassed();
            expect( view.detailEl.find( ".detailItem.hidden" ).length ).toBe( 8 );
        } );
        it( "Wires a click event", function() {
            expect( view.detailEl.find( ".klujsTraceLine.hidden" ).length ).toBe( 5 );
            view.$el.find( ".detailHeadline" ).click();
            expect( view.detailEl.find( ".klujsTraceLine.hidden" ).length ).toBe( 0 );
            expect( view.detailEl.find( ".klujsTraceLine" ).length ).toBe( 5 );
        } );
    } );
    
} );
