/*global define:false, describe:false, it:false, expect:false, runs:false, waits:false, klujs:false */
define( [ "FocusFilterFactory", "SuiteName" ], function( Factory, SuiteName ) {

    describe( "FocusFilterFactory", function() {
        var model = new SuiteName.Model(); // any model will do for tes
        var set = function( name ) {
            model.set( "src", name );
            return model;
        };
        // The dotdot handling is awful.
        var mainMain = "/whack/foo";
        var factory = new Factory( {
            main: ".." + mainMain
        } );
        it( "Uses Klujs config by default", function() {
            var pure = new Factory();
            expect( pure.config ).toBe( klujs );
        } );

        it( "Filters based on main setting and directory name", function() {
            var filter = factory.create( "sooner/or" );           
            expect( filter(set( mainMain + "/sooner/or/Later.js" )) )
                .toBe( true );
            expect( filter(set( mainMain + "/sooner/or/much/Later.js" )) )
                .toBe( false );
            expect( filter(set( mainMain + "/later/or/Later.js" )) )
                .toBe( false );
        } );
        it( "Treats (base) specially", function() {
            var filter = factory.create( "(base)" );
            expect( filter(set( mainMain + "/Zot.js" )) )
                .toBe( true );
            expect( filter(set( "/elsewhere" + mainMain + "/Zot.js" )) )
                .toBe( false );
            expect( filter(set( mainMain + "/subpackage/Zot.js" )) )
                .toBe( false );
            
        } );
    } );
} );
