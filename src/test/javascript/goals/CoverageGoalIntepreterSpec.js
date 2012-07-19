/*global define:false, describe:false, it:false, expect:false, runs:false, waits:false, klujs:false */
define( [ "goals/CoverageGoalInterpreter" ], function( CoverageGoalInterpreter ) {

    describe( "CoverageGoalInterpreter", function() {
        it( "Accepts null configuration", function() {
            var interp = new CoverageGoalInterpreter( );
            var topic = interp.goalForFile();
            expect( topic.max ).toBeUndefined();
            expect( topic.min ).toBeUndefined();
            expect( topic.rules ).toEqual( [] );
        } );
        it( "Accepts blank min setting", function() {
            var interp = new CoverageGoalInterpreter( {
                max : 7
            } );
            var x = interp.goalForFile();
            expect( x.max ).toBe( 7 );
            expect( x.min ).toBeUndefined();
        } );
        it( "Accepts blank min setting", function() {
            var interp = new CoverageGoalInterpreter( {
                min : 0.9
            } );
            var x1 = interp.goalForFile();
            expect( x1.min ).toBe( 0.9 );
            expect( x1.max ).toBeUndefined();
        } );
        describe( "Exception rules", function() {
            var interp = new CoverageGoalInterpreter( {
                max : 1,
                min : 0.9,
                except : {
                    "fileMax" : {
                        files : [ "foo", "bar" ],
                        max : 0
                    },
                    "fileMin" : {
                        files : [ "foo", "baz" ],
                        min : 0.8
                    },
                    "suite" : {
                        suites: [ "weird" ],
                        max : 3,
                        min : 0
                    }
                }
            } );
            it( "Gives default when rules do not apply", function() {
                var x = interp.goalForFile( "goody", "twoShoes" );
                expect( x.max  ).toBe( 1 );
                expect( x.min ).toBe( 0.9 );
                expect( x.rules ).toEqual( [] );
            } );
            it( "Handles individual file exceptions", function() {
                var x = interp.goalForFile( "goody", "blabarzog" );
                expect( x.max ).toBe( 0 );
                expect( x.min ).toBe( 0.9 );
                expect( x.rules ).toEqual( [ "fileMax" ] );
                var y = interp.goalForFile( "goody", "bazzog" );
                expect( y.max  ).toBe( 1 );
                expect( y.min ).toBe( 0.8 );
                expect( y.rules ).toEqual( [ "fileMin" ] );
            } );
            it( "Handles suite-wide exceptions", function() {
                var x = interp.goalForFile( "weird", "twoShoes" );
                expect( x.max  ).toBe( 3 );
                expect( x.min ).toBe( 0.0 );
                expect( x.rules ).toEqual( [ "suite" ] );
            } );
            it( "Handles multiple rules", function() {
                var x = interp.goalForFile( "goody", "foogoo" );
                expect( x.max ).toBe( 0 );
                expect( x.min ).toBe( 0.8 );
                expect( x.rules ).toEqual( [ "fileMax", "fileMin" ] );
                var y = interp.goalForFile( "weird", "foogoo" );
                expect( y.max ).toBe( 3 );
                expect( y.min ).toBe( 0.0 );
                expect( y.rules ).toEqual( [ "fileMax", "fileMin", "suite" ] );
            } );

        } );
    } );
} );
