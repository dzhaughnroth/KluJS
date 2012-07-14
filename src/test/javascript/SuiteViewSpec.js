/*global define:false, describe:false, it:false, expect:false, runs:false, waits:false */
define( [ "SuiteView", "SuiteAssembly", "jquery" ], function( SuiteView, SuiteAssembly, $ ) {

    describe( "SuiteView", function() {
        var topic = new SuiteView( { model : new SuiteAssembly() }).render();
        it( "Renders divs for name, jasmine, lint and coverage", function() {
            expect( topic.$el.children("div").length ).toBe( 4 );
//            expect( topic.$el.find("div div").length ).toBe( 5 );
//            topic.$el.insertAfter( $("body #div:last" ) );
//            $("body").append( topic.$el );
        } );

        
    } );
} );
