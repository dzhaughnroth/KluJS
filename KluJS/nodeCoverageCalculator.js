/*global define:false */
define( [ "jquery" ], function( $ ) {

    var CoverageSummary = function( count, missed ) {
        this.count = count || 0;
        this.missed = missed || 0;
        this.__defineGetter__("rate", function() {
            var result = 0;
            if ( this.count > 0 ) {
                result = 1 - this.missed / this.count;
            }
            return result;
        } );
    };

    var NodeCoverageCalculator = function( nodeCoverage ) {
        this.nodeCoverage = nodeCoverage;
        this.coverageByFile = {};
        this.conditionsByLine = {};
        var self = this;

        var tokenRegx = /\d*_/;
        var lineNumberForToken = function( token ) {
            var x = tokenRegx.exec( token );
            return parseInt( x, 0 );
        };
        var computeRate = function( coverageSummary ) {
            if ( coverageSummary.count ) {
                coverageSummary.rate = 1.0 - coverageSummary.missed / coverageSummary.count;
            }
            else {
                coverageSummary.rate = 0;
            }
        };

        var lineCoverageForFile = function( fileName ) {
            var coveredLines = 0;
            var lines = nodeCoverage.lines[fileName];
            var lineNumbers = [];
            var lineCoverages = {};
            var runLines = nodeCoverage.runLines[fileName];
            $.each( lines, function( j, token ) {
                var lnum = lineNumberForToken( token );
                lineNumbers.push( lnum );
                lineCoverages[lnum] = { covered:false };
                if ( runLines[token] > 0 ) {
                    ++coveredLines;
                    lineCoverages[lnum].covered = true;
                }
            } );
            var result = new CoverageSummary( lines.length, lines.length - coveredLines );
            result.lineNumbers = lineNumbers;
            result.lineCoverages = lineCoverages;
            return result;
        };

        var coverageForFile = function( fileName ) {
          
            var unlines = { };
            var lineCoverage = lineCoverageForFile( fileName );
            var branchCoverage = new CoverageSummary();
            var elementCoverage = new CoverageSummary();
            var allConds = nodeCoverage.allConditions[ fileName ];
            var conditionCoverage = {};
            $.each( allConds, function( i, token ) {
                var ln = lineNumberForToken( token );
                var cov = { name:token };
                conditionCoverage[token] = cov;
                var conds = lineCoverage.lineCoverages[ ln ];
                if ( conds ) {
                    conds.conditions = conds.conditions || [];
                    conds.conditions.push( cov );
                }
                else {
                    unlines[ln] = unlines[ln] || [];
                    unlines[ln].push( cov );
                }
            } );
            $.each( nodeCoverage.conditions[fileName], function( x, pair ) {
                var condToken = pair[0];
                var side = pair[1] ? "t" : "f";
                var cc = conditionCoverage[condToken];
                if ( cc ) {
                    cc[side] = true;
                }
            } ); 
            var analyzeConditionCoverageEntry = function( j, cov ) {
                elementCoverage.count += 2;
                branchCoverage.count += 2;
                if ( ! cov.t ) {
                    ++elementCoverage.missed;
                    ++branchCoverage.missed;
                }
                if ( ! cov.f ) {
                    ++elementCoverage.missed;
                    ++branchCoverage.missed;
                }

            };
            $.each( lineCoverage.lineCoverages, function( ln, cov ) {
                if ( cov.conditions ) { // multibranch line
                    $.each( cov.conditions, analyzeConditionCoverageEntry );
                }               
                else { // simple line
                    ++elementCoverage.count;
                    if ( ! cov.covered ) {
                        ++elementCoverage.missed;
                    }
                }
            } );
            $.each( unlines, analyzeConditionCoverageEntry );
            computeRate( elementCoverage );
            computeRate( branchCoverage );
            return {
                line : lineCoverage,
                element : elementCoverage,
                branch : branchCoverage,
                unlines : unlines
            };
        };

        $.each( nodeCoverage.lines, function( fileName, lineTokens ) {
            self.coverageByFile[fileName] = coverageForFile( fileName );
        } );

    };

    return NodeCoverageCalculator;
} );

