/*global define:false, describe:false, it:false, expect:false, runs:false, waits:false */
define( [ "SuiteView", "SuiteAssembly", "jquery" ], function( SuiteView, SuiteAssembly, $ ) {

    describe( "SuiteView", function() {
        var topic = new SuiteView( { model : new SuiteAssembly() }).render();
        it( "Renders divs for name, jasmine, lint and coverage", function() {
            expect( $.contains( topic.$el, topic.nameView.$el ) ).toBe( true );
            expect( $.contains( topic.$el, topic.jasmineView.$el ) ).toBe( true );
            expect( $.contains( topic.$el, topic.lintView.$el ) ).toBe( true );
            expect( $.contains( topic.$el, topic.coverageView.$el ) ).toBe( true );
            expect( $.contains( topic.$el, topic.focusView.$el ) ).toBe( true );
            expect( topic.nameView.$el.text() ).not.toMatch( "anything" );
            topic.model.name.set("suiteName", "anything" );
            expect( topic.nameView.$el.text() ).toMatch( "anything" );

            expect( topic.$el.children("div").length ).toBe( 4 );
        } );

        
    } );
} );
