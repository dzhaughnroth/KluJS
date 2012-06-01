/*global define:false, _$jscoverage:false, $$_l:false */
define( ["require", "jquery", "./nodeCoverageCalculator", "./lib/jquery.datatables.min"], function(req, $, NodeCoverageCalculator) {

    var mydiv;
    var bannerDiv;

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

    var mergeNodeCoverageData = function( childRunners ) {
        var result = { lines: {},
                       runLines: {},
                       allConditions : {},
                       conditions: {} 
                     };
        $.each( childRunners, function( i, runner ) {
            var q = runner.frame.contentWindow.$$_l;
            mergeLines( result.lines, q.lines );
            mergeRunlines( result.runLines, q.runLines );
            mergeAllConditions( result.allConditions, q.allConditions );
            mergeConditions( result.conditions, q.conditions );
        } );
        return result;
    };


    this.showCoverage = function( childRunners ) {
        mydiv = $("<div />", {id:"jscoverageContainer"}).appendTo( $("body") );
        bannerDiv = $( "<div />", { id: "jscoverageBanner", 
                                    text: "Code Coverage" } )
            .appendTo( mydiv );
        mydiv.addClass( "jscoverageContainer" );
        var jsc;
        if ( typeof( _$jscoverage ) !== "undefined" ) {
            jsc = _$jscoverage;
            this.buildCoverageDiv( jsc, req.toUrl( "./lib/jscoverage/jscoverage.html" ));
        }
        else if( typeof( $$_l ) !== "undefined" ) {          
            if ( childRunners ) {
                jsc = mergeNodeCoverageData( childRunners );
            }
            else {
                jsc = $$_l;
            }
            this.buildNodeCoverageDiv( jsc );
        }
        else {
            $( "<p />", { text:"No coverage data" } ).appendTo( mydiv );
        }
        return mydiv;
    };

    var summary = function( fileName, coverage ) {
        var i = 0,
            lines = 0,
            linesCovered = 0;
        for( i = 0; i < coverage.length; i++ ) {
            if ( typeof( coverage[i] ) !== "undefined" ) {
                ++lines;
                if ( coverage[i] > 0 ) {
                    ++linesCovered;
                }
            }
        }
        return { fileName:fileName, lines:lines, linesCovered:linesCovered };
    };

    this.buildNodeCoverageDiv = function( nodeCoverage ) {
        $("<button />", {text:"node-coverage", disabled:true} ).appendTo( bannerDiv );
        var table = $( "<table />", { id: "pcovTable",
                                      cellpadding: "0",
                                      cellspacing: "0",
                                      border : "0" } )
                .addClass("display")
                .appendTo( mydiv );
        var covDataSums = [];
        var calc = new NodeCoverageCalculator( nodeCoverage );
        $.each( calc.coverageByFile, function( fileName, coverage ) {
            covDataSums.push( [ fileName, 
                                coverage.element.count,
                                coverage.element.missed,
                                coverage.element.rate.toFixed(2),
                                coverage.line.count,
                                coverage.line.missed,
                                coverage.line.rate.toFixed(2)
//                                coverage.branch.count,
//                                coverage.branch.missed
                              ] );
        } );
        table.dataTable( {
            aaData : covDataSums,

            aoColumns : [ { "sTitle": "File" },
                          { "sTitle" : "<span title='Number of elements'>N</span>" },
                          { "sTitle" : "<span title='Elements missed'>m</span>" },
                          { "sTitle" : "<span title='Coverage Rate'>%</span>" },
                          { "sTitle" : "<span title='Number of lines'>Nl</span>" },
                          { "sTitle" : "<span title='Lines missed'>ml</span>" },
                          { "sTitle" : "<span title='Coverage rate'>%l</span>" }
//                          { "sTitle" : "<span title='Branches'>Nb</span>" },
//                          { "sTitle" : "<span title='Branches missed'>mb</span>" }
                        ],
            bPaginate : false,
            bFilter : false,
            bInfo : false,
            bAutoWidth : false 
        } );
    };

    this.buildCoverageDiv = function( jsCoverage, pathToCoverageHtml ) {
        $( "<button />", { text: "View full report",
                           "onclick":"window.open( '" 
                           + pathToCoverageHtml + "' )" } )
            .appendTo( bannerDiv );


        var table = $( "<table />", { id: "pcovTable",
                                        cellpadding: "0",
                                        cellspacing: "0",
                                        border : "0" } )
                .addClass("display")
                .appendTo( mydiv );
        var covDataSums = [];
        $.each( jsCoverage, function( x ) {
            var coverage = jsCoverage[x];
            var s = summary( x, coverage );
            var rate = 0.0;
            if ( s.lines > 0 ) {
                rate = ( ( s.linesCovered ) / ( s.lines )).toFixed( 2 );
            }
            covDataSums.push( [ s.fileName, 
                                s.lines, 
                                s.lines - s.linesCovered,
                                rate ] );
        } );
        table.dataTable( {
            "aaData": covDataSums,
            "aoColumns": [ { "sTitle" : "File" }, 
                           { "sTitle" : "<span title='Number of lines'>N</span>" },
                           { "sTitle" : "<span title='Lines missed'>m</span>" },
                           { "sTitle" : "<span title='Coverage rate'>%</span>" } ],
            "bPaginate" : false,
            "bFilter" : false,
            "bInfo" : false,
            "bAutoWidth" : false
        } );
    };

    return this;

});