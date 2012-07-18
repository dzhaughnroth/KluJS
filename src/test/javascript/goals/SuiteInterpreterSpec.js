/*global define:false, describe:false, it:false, expect:false, runs:false, waits:false, klujs:false */
define( [ "goals/SuiteInterpreter", "goals/CoverageGoalInterpreter", "SuiteName", "Config" ], function( SuiteInterpreter, CoverageGoalInterpreter, SuiteName, notKlujs ) {

    describe( "SuiteInterpreter", function() {
        var model = new SuiteName.Model();
        it( "Defaults to global configuration", function() {
            var topic = new SuiteInterpreter( model );
            expect( topic.lineGoals.config ).toBe( notKlujs.lineCoverage() );
            expect( topic.elementGoals.config ).toBe( notKlujs.elementCoverage() );
        } );
        it( "Specializes goals using suite name", function() {
            var mock = {
                max : 2,
                except : {
                    foo : {
                        suites: ["goo"],
                        max : 0
                    }
                }
            };
            var topic = new SuiteInterpreter( model, mock, mock );
            expect( topic.lineGoals.config ).toBe( mock );
            expect( topic.elementGoals.config ).toBe( mock );            
            model.set( "suiteName", "goo" );                    
            expect( topic.suiteName() ).toBe( "goo" );
            expect( topic.lineGoal( "zoo" ).max ).toBe( 0 );
            expect( topic.elementGoal( "zoo" ).max ).toBe( 0 );
            model.set( "suiteName", "bar" );
            expect( topic.suiteName() ).toBe( "bar" );
            expect( topic.lineGoal( "zoo" ).max ).toBe( 2 );
            expect( topic.elementGoal( "zoo" ).max ).toBe( 2 );
            


        } );


    } );
} );
