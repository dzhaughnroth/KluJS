/*global define:false, _$jscoverage:false */
define( ["require", "jquery", "./lib/jquery.datatables.min"], function(req, $) {

    this.showCoverage = function( ) {
        var mydiv = $("<div />", {id:"jscoverageContainer"}).appendTo( $("body") );
        var jsc = "";
        if ( typeof( _$jscoverage ) !== "undefined" ) {
            jsc = _$jscoverage;
        }
        this.buildCoverageDiv( jsc, mydiv, req.toUrl( "./lib/jscoverage/jscoverage.html" ));
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


    this.buildCoverageDiv = function( jsCoverage, targetDiv, pathToCoverageHtml ) {
         var bannerDiv = $( "<div />", { id: "jscoverageBanner", 
                         text: "JSCoverage" } )
            .appendTo( targetDiv );
        targetDiv.addClass( "jscoverageContainer" );
        if( jsCoverage === "") {
            $( "<p />", { text:"No coverage data" } ).appendTo( targetDiv );
            return targetDiv;
        }

        $( "<button />", { text: "View full report",
                           "onclick":"window.open( '" 
                           + pathToCoverageHtml + "' )" } )
            .appendTo( bannerDiv );


        var table = $( "<table />", { id: "pcovTable",
                                        cellpadding: "0",
                                        cellspacing: "0",
                                        border : "0" } )
                .addClass("display")
                .appendTo( targetDiv );
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

        return targetDiv;
    };

    return this;

});