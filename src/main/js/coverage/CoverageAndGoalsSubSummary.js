/*global define:false, jasmine:false*/
define( [ ], function( ) {

    // half of an element of a join or coverage and goals
    // half in the sense of line part or element part.
    // subthing has count, missed, rate properties
    // subgoals has min, max, rules properties.
    
    var CoverageAndGoalsSubSummary = function( subthing, subgoals ) {
        this.count = subthing.count;
        this.missed = subthing.missed;
        this.rate = subthing.rate;
        this.min = subgoals.min;
        this.max = subgoals.max;
        this.rules = subgoals.rules;
    };
    CoverageAndGoalsSubSummary.prototype.hasMin = function() {        
        return typeof( this.min ) !== "undefined";
    };
    CoverageAndGoalsSubSummary.prototype.hasMax = function() {
        return typeof( this.max ) !== "undefined";
    };
    CoverageAndGoalsSubSummary.prototype.minOk = function() {
        return ! this.hasMin() || this.min <= this.rate;
    };
    CoverageAndGoalsSubSummary.prototype.maxOk = function() {
        return ! this.hasMax() || this.max >= this.missed;
    };
    CoverageAndGoalsSubSummary.prototype.allOk = function() {
        return this.minOk() && this.maxOk();
    };
    return CoverageAndGoalsSubSummary;
} );