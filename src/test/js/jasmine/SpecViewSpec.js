/*global define:false, describe:false, it:false, expect:false, runs:false, waitsFor:false, waits:false */
define( [ "jasmine/SpecView", "jasmine/SpecModel", "jasmine/BlinkySpecView", "./MockJasmine.js", "notJQuery" ], function( SpecView, SpecModel, BlinkySpecView, MockJasmine, $ ) {

    var mockJasmine = new MockJasmine();
    var mockSpec = mockJasmine.makeMockSpec();

    describe( "SpecView", function() {
        var model = new SpecModel();
        var view = new SpecView( { model : model } ).render();
        var blinker = new BlinkySpecView( { model : model} ).render();

        var checkBlinker = function( clazz, text, nonClasses ) {
            expect( blinker.$el.attr( "class" ) ).toMatch( clazz );
            expect( blinker.$el.text() ).toBe( text );
            if ( nonClasses ) {
                $.each( nonClasses, function( i, x ) {
                    expect( blinker.$el.attr("class" ) ).not.toMatch( x );
                });
            }
        };
        it( "Initially empty", function() {
            expect( view.titleEl.text() ).toBe( "...loading..." );
            expect( view.$el.attr("class") ).toBe( "jasmineSpecView" );
            checkBlinker( "new", "*" );
        } );
        it( "Displays spec description", function() {
            model.set( "spec", mockSpec );
            expect( view.titleEl.text() ).toBe( "spec1" );
            expect( view.$el.attr("class") ).toBe( "jasmineSpecView" );
            checkBlinker( "running", "-", ["new"] );
        } );
        it( "Displays an error in response to nonsense", function() {
            model.set( "done", true );            
            expect( view.titleEl.text() ).toBe( "spec1: Error" );
            expect( view.$el.hasClass( "error" ) ).toBe( true );
            checkBlinker( "error", "?", ["new"] );            
        } );
        it( "Displays pass/fail", function() {
            mockSpec.mockResults = mockJasmine.makeMockResults( 10, 1 );
            model.set( "done", false );
            model.set( "done", true );
            expect( view.titleEl.text() ).toBe( "spec1: 1/10 failed" );
            expect( view.$el.hasClass( "hidden" ) ).toBe( false ); //autohide.
            expect( view.$el.hasClass( "failed" ) ).toBe( true );
            checkBlinker( "failed", "!", ["running", "new"] );

            mockSpec.mockResults = mockJasmine.makeMockResults( 0, 0 );
            model.set( "done", false );
            model.set( "done", true );
            expect( view.$el.hasClass( "error" ) ).toBe( false );
            expect( view.$el.hasClass( "passed" ) ).toBe( true );

            checkBlinker( "passed", ".", ["error", "failed"] ); 
           
            mockSpec.mockResults = mockJasmine.makeMockResults( 10, 0 );
            model.set( "done", false );
            model.set( "done", true );
            expect( view.$el.hasClass( "passed" ) ).toBe( true );
            expect( view.titleEl.text() ).toBe( "spec1 passed" );
            checkBlinker( "passed", ".", ["error", "failed"] ); 
        } );
        it ( "Autohides when passed, if configured to do so", function() {
            expect( view.autoHide ).toBe( true );
            expect( view.$el.hasClass( "hidden" ) ).toBe( true );
            view.autoHide = false;
            model.set( "done", false );
            model.set( "done", true );
            expect( view.$el.hasClass( "hidden" ) ).toBe( false );

        } );
    } );
    
} );
