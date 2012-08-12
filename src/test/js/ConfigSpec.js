/*global define:false, describe:false, it:false, expect:false, klujs:true */
define( [ "Config" ], function( klujsConfig ) {
    
    describe( "KluJSConfig", function() {
        it( "Is a facade based on klujs global", function() {
            expect( klujsConfig.rawConfig ).toBe( klujs );
        } );
    } );
} );
