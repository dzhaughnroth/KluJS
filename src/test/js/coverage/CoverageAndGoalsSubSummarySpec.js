/*global define:false, describe:false, it:false, expect:false, $$_l:false */
define( [ "coverage/CoverageAndGoalsSubSummary" ], function( SubSum ) {

    describe( "CoverageAndGoalsSubSummary", function() {
        var subthing = { count:12, missed : 2, rate : 5/6 };
        it ( "Does not require goals", function() {
            var ss = new SubSum( subthing, {} );
            expect( { count: ss.count, missed:ss.missed, rate:ss.rate } )
                .toEqual( subthing );
            expect( ss.hasMin() ).toBe( false );
            expect( ss.hasMax() ).toBe( false );
            expect( ss.minOk() ).toBe( true );
            expect( ss.maxOk() ).toBe( true );
            expect( ss.allOk() ).toBe( true );
            expect( ss.rules ).toBeUndefined();
        } );
        it( "tests for min rate", function() {
            var ss = new SubSum( subthing, { min : 0.5, rules : [ "zz" ] } );
            expect( ss.hasMin() ).toBe( true );
            expect( ss.hasMax() ).toBe( false );
            expect( ss.minOk() ).toBe( true );
            expect( ss.maxOk() ).toBe( true );
            expect( ss.allOk() ).toBe( true );
            expect( ss.rules ).toEqual( ["zz"] );
        } );
        it( "tests for max missed", function() {
            var ss = new SubSum( subthing, { max : 1, rules : [ ] } );
            expect( ss.hasMin() ).toBe( false );
            expect( ss.hasMax() ).toBe( true );
            expect( ss.minOk() ).toBe( true );
            expect( ss.maxOk() ).toBe( false );
            expect( ss.allOk() ).toBe( false );
            expect( ss.rules ).toEqual( [ ] );
        } );

    } );
} );
