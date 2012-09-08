/*global define:false, describe:false, it:false, expect:false, runs:false, waitsFor:false, waits:false */
define( [ "jasmine/SuiteView", "jasmine/SuiteModel", "notUnderscore", "./MockJasmine.js" ], function( SuiteView, SuiteModel, _, MockJasmine ) {

    var mockJasmine = new MockJasmine();
    var mockSuite = mockJasmine.standardSuite();
    describe( "SuiteView", function() {
        var model = new SuiteModel();
        var view = new SuiteView( { model : model } ).render();
        it( "renders initially empty", function() {
            expect( view.$el.children().length ).toBe( 1 );
            expect( view.$el.children( "div" ).text() ).toBe( "...loading..." );
        } );
        it ( "Renders subviews for specs, suites", function() {
            model.set("suite", mockSuite );
            expect( view.$el.children( ".jasmineSuiteViewDescription" ).text()).toBe( "suite5" );
            expect( view.$el.children( ".jasmineSpecView" ).text() ).toBe( "spec1" );
            var subSuiteEl = view.$el.children( ".jasmineSuiteView" );
            expect( subSuiteEl.children( ".jasmineSuiteViewDescription" ).text() )
                .toBe( "suite4" );
            expect( subSuiteEl.children( ".jasmineSpecView" ).length ).toBe( 2 );
        } );
        it ( "Autohides as configured", function() {
            model.set( "done", true );
            expect( view.$el.hasClass( "hidden" ) ).toBe( false );
            mockSuite.mockResults = mockJasmine.makeMockResults( 10, 0 );

            model.set( "done", false ); model.set( "done", true );
            expect( view.$el.hasClass( "hidden" ) ).toBe( true );
            view.autoHide = false;
            model.set( "done", false ); model.set( "done", true );
            expect( view.$el.hasClass( "hidden" ) ).toBe( false );
            view.autoHide = true;
            mockSuite.mockResults = mockJasmine.makeMockResults( 10, 1 );
            model.set( "done", false ); model.set( "done", true );
            expect( view.$el.hasClass( "hidden" ) ).toBe( false );
            mockSuite.mockResults = mockJasmine.makeMockResults( 0, 0 );
            model.set( "done", false ); model.set( "done", true );
            expect( view.$el.hasClass( "hidden" ) ).toBe( false );
        } );
    } );

                

} );
