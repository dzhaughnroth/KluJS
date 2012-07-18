/*global define:false, jasmine:false*/
define( [ ], function() {

    var SubSummarizer = function( goals, tallies ) {
        this.deltaMissed = goals.missed - tallies.missed;
        this.deltaRate = goals.rate - tallies.rate;
        this.hasFailures = this.deltaMissed < 0 || this.deltaRate < 0;
    };

    var Summarizer = function( goals, tallies ) {
        var line = new SubSummarizer( goals.line, tallies.line );
        var element = new SubSummarizer( goals.element, tallies.element );
        this.hasFailures = line.hasFailures || element.hasFailures;        
    };

    var SuiteSummarizer = function( goals, tallies ) {


    };

    return Summarizer;

} );
