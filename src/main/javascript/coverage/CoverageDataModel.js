/*global define:false, jasmine:false*/
define( [ "./NodeCoverageCalculator", "./CoverageAndGoalsSubSummary", "../lib/notBackbone", "../lib/notUnderscore" ], function( NodeCoverageCalculator, SubSummary, Backbone, _ ) {


    var goalsForFile = function( src, goals ) { // string, SuiteInterpreter
        if( goals ) {
            return goals.thresholdsForFile(src);
        }
        else {
            return { line: {}, element: {} };
        }
    };

    var summary = function( src, fileData, goals ) {
        var fileGoals = goalsForFile( src, goals );
        var lineSum = new SubSummary( fileData.line, fileGoals.line );
        var elSum = new SubSummary( fileData.element, fileGoals.element );        
        return {
            src : src,
            data : fileData,
            line : lineSum,
            element: elSum
        };
    };

    var computeByFile = function( calc, goals ) {
        var result = {};
        _.each( calc.coverageByFile, function( fileData, src ) {
            result[src] = summary( src, fileData, goals );
        } );
        return result;
    };

    var CoverageDataModel = Backbone.Model.extend( {
        defaults : { 
//            coverageData
//            goals
        },
        initialize : function() {
            var self = this;
            _.bindAll( this, "setData" ); 
            this.byFile = {};
            this.on( "change", function() {
                var coverageData = this.get( "coverageData" );
                var calculator = new NodeCoverageCalculator( coverageData );
                self.calculator = calculator;
                self.byFile = computeByFile( calculator, this.get("goals") );
                //compute stuff
            } );
        },
        setData : function( data ) {
            this.set( "coverageData", data );
        }
        // accessors for data and goals and their join
    } );

    return CoverageDataModel;

} );
