/*global define:false, describe:false, it:false, expect:false, runs:false, waits:false, klujs:false */
define( [ "FocusFilterFactory", "SuiteName", "Config" ], function( Factory, SuiteName, Global ) {

    describe( "FocusFilterFactory", function() {
        var model = new SuiteName.Model(); // any model will do for tes
        var set = function( name ) {
            model.set( "src", "/" + name );
            return model;
        };

        var main = "whack/foo";
        var factory = new Factory( {
            main: function() { return main; }
        } );
        it( "Uses Klujs config by default", function() {
            var pure = new Factory();
            expect( pure.config ).toBe( Global );
        } );

        it( "Filters based on main setting and directory name", function() {
            var filter = factory.create( "sooner/or" );           
            expect( filter(set( main + "/sooner/or/Later.js" )) )
                .toBe( true );
            expect( filter(set( main + "/sooner/or/much/Later.js" )) )
                .toBe( false );
            expect( filter(set( main + "/later/or/Later.js" )) )
                .toBe( false );
        } );
        it( "Treats (base) specially", function() {
            var filter = factory.create( "(base)" );
            expect( filter(set( main + "/Zot.js" )) )
                .toBe( true );
            expect( filter(set( "elsewhere/" + main + "/Zot.js" )) )
                .toBe( false );
            expect( filter(set( main + "/subpackage/Zot.js" )) )
                .toBe( false );
            
        } );
    } );
} );
