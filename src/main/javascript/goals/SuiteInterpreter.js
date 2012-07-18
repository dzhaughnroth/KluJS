/*globals define:false */
define( [ "./CoverageGoalInterpreter", "../Config" ], function( CoverageGoalInterpreter, notKlujs ) {
    
    var SuiteInterpreter = function( suiteNameModel, lineGoalConfig, elementGoalConfig ) {
        var lgc = lineGoalConfig || notKlujs.lineCoverage();
        var egc = elementGoalConfig || notKlujs.elementCoverage();

        this.lineGoals = new CoverageGoalInterpreter( lgc );
        this.elementGoals = new CoverageGoalInterpreter( egc );

        this.suiteName = function() {
            return suiteNameModel.get( "suiteName" );
        };

        this.lineGoal = function( fileName ) {
            return this.lineGoals.goalForFile( suiteNameModel.get( "suiteName" ), fileName );
        };

        this.elementGoal = function( fileName ) {
            return this.elementGoals.goalForFile( suiteNameModel.get( "suiteName" ), fileName );
        };

    };

    return SuiteInterpreter;

} );

        
      


