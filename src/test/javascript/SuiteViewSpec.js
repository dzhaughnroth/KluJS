/*global define:false, describe:false, it:false, expect:false, runs:false, waits:false */
define( [ "SuiteView", "SuiteAssembly", "jquery" ], function( SuiteView, SuiteAssembly, $ ) {

    describe( "SuiteView", function() {
        var topic = new SuiteView( { model : new SuiteAssembly() }).render();
        it( "Renders divs for lint and coverage", function() {
            expect( topic.$el.children("div").length ).toBe( 2 );
//            topic.$el.insertAfter( $("body #div:last" ) );
//            $("body").append( topic.$el );
        } );

        
    } );
} );
