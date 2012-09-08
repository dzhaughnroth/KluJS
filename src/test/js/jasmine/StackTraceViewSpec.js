/*global define:false, describe:false, it:false, expect:false, runs:false, waitsFor:false, waits:false */
define( [ "jasmine/StackTraceView", "jasmine/SpecModel", "./MockJasmine.js", "notJQuery" ], function( StackTraceView, SpecModel, MockJasmine, $ ) {

    describe( "StackTraceView", function() {
        var view = new StackTraceView( { model : "Igrnoer\nThis\nThan\nThis/KluJS/Stuff\nFoo" } )
                .render();
        it( "Has a UL for stack trace", function() {
            var el = view.$el;
            expect( el.find( "ul" ).length).toBe( 1 );
            expect( el.find( "li" ).length ).toBe( 4 );
            expect( el.find( "li.hidden" ).length ).toBe( 1 );
            expect( el.find( "li.klujsTraceLine.hidden" ).length ).toBe( 1 );
        } ); 
        it( "Toggles klujs line visibility", function() {
            view.toggleShowFullTrace();
            expect( view.$el.find( "li.klujsTraceLine" ).length ).toBe( 1 );
            expect( view.$el.find( "li.klujsTraceLine.hidden" ).length ).toBe( 0 );            
            view.toggleShowFullTrace();
            expect( view.$el.find( "li.klujsTraceLine" ).length ).toBe( 1 );
            expect( view.$el.find( "li.klujsTraceLine.hidden" ).length ).toBe( 1 );            
        } );
        it( "Can be configured to show full trace by default", function() {
            var v2 = new StackTraceView( { model: "Not\nFoo\nThis/KluJS/Stuff" } );
            v2.toggleShowFullTrace();
            v2.render();
            expect( v2.$el.find( "li.klujsTraceLine" ).length ).toBe( 1 );
            expect( v2.$el.find( "li.klujsTraceLine.hidden" ).length ).toBe( 0 );            
        } );
        it( "Can be empty", function() {
            var v2 = new StackTraceView( ).render();
            expect( v2.$el.children().length ).toBe( 0 );
        } );
    } );
    
} );
