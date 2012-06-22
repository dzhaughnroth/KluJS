/*global define:false, jasmine:false*/
define( [ "./NodeCoverageCalculator", "backbone", "underscore" ], function( NodeCoverageCalculator, Backbone, _ ) {

    var SrcModel = Backbone.Model.extend( {
        defaults : { 
//            calculator : {},
//            src : "zz"
        },
        initialize : function() {
            _.bindAll( this, "data" );
        },
        data : function() {
            return this.get("calculator").coverageByFile[ this.get("src") ];
        }
    } );

    var ProjectModel = Backbone.Collection.extend( {
        model : SrcModel,
        initialize : function() {
            _.bindAll( this, "setData" );
        },
        setData : function( coverageData ) {
            var calculator = new NodeCoverageCalculator( coverageData );
            var models = [];
            _.each( calculator.coverageByFile, function( x, src ) {
                models.push( { src:src, calculator:calculator } );
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
