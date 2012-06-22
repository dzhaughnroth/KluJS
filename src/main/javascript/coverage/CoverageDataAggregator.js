/*global define:false, jasmine:false*/
define( [ "jquery" ], function( $ ) {

        var mergeLines = function( accumLines, lines ) {
            $.each( lines, function( fileName, lineList ) {
                if ( ! accumLines[fileName] ) {
                    // assert: no need to clone, this is a static list for each file.
                    accumLines[fileName] = lineList;
                }
            } );
        };

        var mergeRunlines = function( accumRl, runLines ) {
            $.each( runLines, function( fileName, items ) {
                if ( !accumRl[fileName] ) {
                    accumRl[fileName] = {};
                }
                var fileAccum = accumRl[fileName];
                $.each( items, function( token, count ) {
                    if ( ! fileAccum[token] ) {
                        fileAccum[token] = count;
                    }
                    else {                    
                        fileAccum[token] += count;
                    }
                } );
            } );
        };
        
        var mergeAllConditions = function( accumAc, allConditions ) {
            $.each( allConditions, function( fileName, items ) {
                if ( !accumAc[fileName] ) {
                    // assert: no need to clone, this is a static list for each file.
                    accumAc[fileName] = items;
                }
            } );
        };
        
        var mergeConditions = function( accumCond, conditions ) {
            $.each( conditions, function( fileName, condHitArray ) {
                var accHits = accumCond[fileName];
                if( !accHits ) {
                    accHits = [];
                    accumCond[fileName] = accHits;
                }
                // each pair is [token, t/f branch]
                $.each( condHitArray, function( i, pair ) {
                    var newPair = [];
                    newPair[0] = pair[0];
                    newPair[1] = pair[1];
                    accHits.push( newPair );
                } );
            } );
            
        };
        
        var mergeNodeCoverageData = function( dataArray ) {
            var result = { lines: {},
                           runLines: {},
                           allConditions : {},
                           conditions: {} 
                         };
            $.each( dataArray, function( i, data ) {
                mergeLines( result.lines, data.lines );
                mergeRunlines( result.runLines, data.runLines );
                mergeAllConditions( result.allConditions, data.allConditions );
                mergeConditions( result.conditions, data.conditions );
            } );
            return result;
        };
    
    return mergeNodeCoverageData;
} );