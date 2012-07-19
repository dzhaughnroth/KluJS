/*globals define:false */
define( [ "../lib/notUnderscore" ], function( _ ) {
    var noGoal = { rules : [] };
    
    var CoverageGoalInterpreter = function( goalConfig ) {

        var baseGoal = function() {
            return {
                max: goalConfig.max,
                min: goalConfig.min,
                rules : [] // the except rules that were applied to comptue min/max
            };
        };

        var hasMatch = function( names, name ) {
            var result = false;
            _.each( names, function( x ) {
                // TODO compile
                if ( new RegExp( x ).test( name ) ) {
                    result = true;
                }
            } );
            return result;
        };

        var adjustGoal = function( result, delta ) {
            // zero is a legit override; undefined or null is accept default
            if ( delta.max || delta.max === 0) {
                result.max = delta.max;
            }
            if ( delta.min || delta.min === 0 ) {
                result.min = delta.min;
            }
        };

        var goalForFile = function( suiteName, fileName ) {
            var result = noGoal;
            if ( goalConfig ) {
                result = baseGoal();
                _.each( goalConfig.except, function( rule, name ) {
                    if ( hasMatch( rule.suites, suiteName ) 
                         || hasMatch( rule.files, fileName ) ) {
                             adjustGoal( result, rule );
                             result.rules.push( name );
                         }
                } );
            }
            return result;
        };

        this.goalForFile = goalForFile;
        this.config = goalConfig;
    };

    return CoverageGoalInterpreter;
} );

        
      


