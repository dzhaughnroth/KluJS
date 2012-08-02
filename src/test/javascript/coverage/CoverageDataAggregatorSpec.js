/*global JSON:false, define:false, $$_l:false, describe:false, it:false, expect:false */
define( [ "coverage/CoverageDataAggregator"], function( CoverageDataAggregator ) {
    describe( "CoverageDataAggregator", function() {
        var makeMockCoverageData = function( x ) {
            var src = x + "src";
            var result = { 
                lines: { 
                    zsrc : [ "z1", "z2" ] 
                },
                runLines: {
                    zsrc: { z1 : 1, z2 : 1 }
                },
                allConditions: {
                    zsrc: [ "zc1a" ]
                },
                conditions: {
                    zsrc: [ ["zc1a", true] ]
                }
            };
            result.lines[src] = [ x + "1", x + "2" ];
            result.runLines[src] = {};
            result.runLines[src][ x + "1"] = 3;
            result.runLines[src][ x + "2"] = 0;
            result.allConditions[src] = [ x + "1ca", x + "1cb"];
            
            result.conditions[src] = 
                [ [ x + "1ca", true ], [ x + "1ca", false ] ];
            
            return result;
        };
        var a = makeMockCoverageData( "a" );
        var b = makeMockCoverageData( "b" );
        var c = makeMockCoverageData( "c" );
        c.conditions.zsrc.push( ["zc1a", false] );
        var result = CoverageDataAggregator( [ a, undefined, b ] );
        var doubledConds = [].concat( a.conditions.zsrc ).concat( a.conditions.zsrc );

        it( "AggrgatesCoverage", function() {
            expect( result.lines.asrc ).toEqual( a.lines.asrc );
            expect( result.lines.bsrc ).toEqual( b.lines.bsrc );
            expect( result.lines.zsrc ).toEqual( a.lines.zsrc );
            expect( result.runLines.asrc ).toEqual( a.runLines.asrc );
            expect( result.runLines.bsrc ).toEqual( b.runLines.bsrc );
            expect( result.runLines.zsrc ).toEqual( { z1:2, z2:2 } ); // hit twice
            expect( result.allConditions.asrc ).toEqual( a.allConditions.asrc );
            expect( result.allConditions.bsrc ).toEqual( b.allConditions.bsrc );
            expect( result.allConditions.zsrc ).toEqual( a.allConditions.zsrc );
            expect( result.conditions.asrc ).toEqual( a.conditions.asrc );
            expect( result.conditions.bsrc ).toEqual( b.conditions.bsrc );
            // TODO it is not clear this is the best thing to expect.
            // but, it gets cleaned up by node coverage calculator
            expect( result.conditions.zsrc ).toEqual( doubledConds );
        } );
        it( "Merges conditions", function() {
            var abc = CoverageDataAggregator( [a, b, c] );
            var expectedConds = doubledConds.concat( a.conditions.zsrc );
            expectedConds.push( [ "zc1a", false ] );
            expect( abc.conditions.zsrc ).toEqual( expectedConds );
        } );

    } );
} );