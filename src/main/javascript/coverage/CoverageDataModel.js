/*global define:false, jasmine:false*/
define( [ "./NodeCoverageCalculator", "../lib/notBackbone", "../lib/notUnderscore" ], function( NodeCoverageCalculator, Backbone, _ ) {

    var SrcModel = Backbone.Model.extend( {
        defaults : { 
//            calculator : {},
//            src : "zz"
        },
        initialize : function() {
            _.bindAll( this, "data" );
            var goalThresholds = {
                line : {
                },
                element: {
                }
            };
            if ( this.get("goals") ) {
                var goals = this.get( "goals" );
                var lineGoal = goals.lineGoal( this.get( "src" ) );
                var elGoal = goals.elementGoal( this.get("src" ));
                
                goalThresholds.line.max = lineGoal.max;
                goalThresholds.line.min = lineGoal.min;
                goalThresholds.element.max = elGoal.max;
                goalThresholds.element.min = elGoal.min;
                
                goalThresholds.line.rules = lineGoal.exceptionRules;
                goalThresholds.element.rules = elGoal.exceptionRules;
            }
            this.targets = goalThresholds;
        },
        data : function() {
            return this.get("calculator").coverageByFile[ this.get("src") ];
        },
        // Join of data() and targets.
        goalReport : function() {
            var data = this.data();
            var targs = this.targets;
            var result = {
                line : {
                    max : {
                        val : data.line.missed,
                        goal : targs.line.max,
                        passed : data.line.missed <= targs.line.max
                    },                    
                    min : {
                        val : data.line.rate,
                        goal : targs.line.min,
                        passed : data.line.rate >= targs.line.min
                    },
                    rules : targs.line.rules
                },
                element : {
                    max : {
                        val : data.element.missed,
                        goal : targs.element.max,
                        passed : data.element.missed <= targs.element.max
                    },                    
                    min : {
                        val : data.element.rate,
                        goal : targs.element.min,
                        passed : data.element.rate >= targs.element.min
                    },
                    rules : targs.element.rules
                }
            };
            return result;
        }

    } );

    var ProjectModel = Backbone.Collection.extend( {
        model : SrcModel,
        initialize : function() {
            _.bindAll( this, "setData" );            
        },
        setData : function( coverageData ) {
            var self = this;
            var calculator = new NodeCoverageCalculator( coverageData );
            var models = [];
            _.each( calculator.coverageByFile, function( x, src ) {
                models.push( { src:src, calculator:calculator, goals:self.goals } );
            } );
            this.calculator = calculator;
            this.reset( models );
        },
        comparator : function( srcModelA, srcModelB ) {
            var a = srcModelA.get( "src" );
            var b = srcModelB.get( "src" );
            if ( a === b ) {
                return 0;
            }
            else {
                return a < b ? -1 : 1;
            }
        }
        // Perhaps add methods to compute aggregates here.
        // Perhaps merge method here.
    } );

    return {
        SrcModel:SrcModel,
        ProjectModel:ProjectModel
    };

} );
