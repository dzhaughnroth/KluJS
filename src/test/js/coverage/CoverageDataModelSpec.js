/*global define:false, describe:false, it:false, expect:false, $$_l:false, beforeEach:false */
define( [ "coverage/CoverageDataModel", "coverage/NodeCoverageCalculator", "goals/SuiteInterpreter", "notUnderscore", "./fixture/trinary.js", "./fixture/simple.js", "./fixture/target.js" ], function( CoverageDataModel, NodeCoverageCalculator, SuiteInterpreter, _ ) {

    describe( "CoverageDataModel", function() {
        var topic = new CoverageDataModel();
        var fixtures;
        var events = [];
        topic.on( 'change', function() { events.push( arguments ); } );
        beforeEach( function() { events = []; } );
        it ( "Should be initially empty", function() {
            expect( topic.calculator).toBeUndefined();
        } );
        it ( "Should accept noData call if there will be no coverage data", function() {
            topic.noData();
            expect( topic.get("coverageData" ) ).toBeUndefined();
            expect( topic.calculator ).toBeUndefined();
            expect( events[0][1].changes.noData ).toBe( true );
            expect( topic.get("noData" )).toBe( true );
        } );
        it( "Should accept node coveage data", function() {
            topic.setData( $$_l );            
            expect( topic.calculator.nodeCoverage).toBe( $$_l );
            expect( events.length ).toBe( 1 );
            var sums = _.values( topic.byFile );           
            expect( sums.length > 3 ).toBe( true );
            fixtures = _.filter( sums, function( item ) { 
                return item.src.indexOf( "fixture" ) > 0; 
            } );
            expect( fixtures.length ).toBe( 3 );
            var x = _.filter( fixtures, function( item ) { 
                return item.src.indexOf( "target" ) > -1; } )[0];
            expect( x.element.missed ).toBe( 17 );
            expect( x.line.missed ).toBe( 4 );
        } ); 
        it( "Should merge data and coverage goals", function() {
            expect( topic.goalFailureCount() ).toBe( 0 );
            var mock = {
                max : 2,
                except : {
                    "fooRule" : {
                        files : ["target"],
                        max : 5
                    }
                }

            };
            var goals = new SuiteInterpreter( { get : function() { return "foo"; } }, 
                                              mock, mock );
            topic.set( "goals", goals );
            var xs = _.filter( _.values( topic.byFile ),
                              function(item) {
                                  return item.src.indexOf( "target" ) > -1;
                              } );
            expect( xs.length ).toBe( 1 );
            expect( xs[0].line.missed ).toBe( 4 );
            expect( xs[0].line.max ).toBe( 5 );
            expect( xs[0].line.hasMax() ).toBe( true );
            expect( xs[0].line.maxOk() ).toBe( true );
            expect( xs[0].line.rules ).toEqual( ["fooRule"] );            
            expect( xs[0].element.max ).toBe( 5 );
            expect( xs[0].element.hasMax() ).toBe( true );
            expect( xs[0].element.maxOk() ).toBe( false );
            expect( xs[0].line.rules ).toEqual( ["fooRule"] );
            
            expect( topic.goalFailureCount() > 1 ).toBe( true );
        } );
    } );
} );
