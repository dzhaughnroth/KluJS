/*global define:false, describe:false, it:false, expect:false, $:false */
define( [ "notJQuery" ], function( x$ ) {
    describe( "The notJQuery library", function() {
        it( "Should not be $", function() {
            expect( typeof $ ).toBe( "undefined" );
            expect( x$ ).toBeDefined();
            expect( x$ !== $ ).toBe( true );
        } );
        it( "Should have datatable plugin loaded", function() {
            expect( x$("<table />").dataTable ).toBeDefined();
        } );
    } );
} );
