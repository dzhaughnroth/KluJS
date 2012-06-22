/*global define:false, jasmine:false*/
define( ["backbone", "underscore", "jquery", "../lib/jquery.datatables.min" ], function( Backbone, _, $ ) {

    var DtView = Backbone.View.extend( {
        tagName : "div",
        className : "coverageDataView",
        initialize : function() {
            _.bindAll( this, "render", "buildTableData" );
            var self = this;
            this.model.on( "reset", function() {
                self.render( );
            } );
        },
        render : function() {
            this.$el.empty();
            var banner = $( "<div />" )
                    .addClass( "coverageBanner" )
                    .appendTo( this.$el );
            $("<span />", { text:"Code Coverage" } )
                .addClass( "coverageTitle" )
                .appendTo( banner );
            $("<button />", {text:"node-coverage", disabled:true} )
                .appendTo( banner );
            if( ! this.model.calculator ) {
                this.$el.append( $( "<div />", { text: "Pending..." } ) );
                return this;
            }
            
            var table = $( "<table />", { } )
                    .addClass("coverageTable")
                    .addClass("display")
                    .appendTo( this.$el );
            var data = this.buildTableData();
            table.dataTable( {
                aaData : data,
                aoColumns : [ { "sTitle": "File" },
                              { "sTitle" : "<span title='Number of elements'>N</span>" },
                              { "sTitle" : "<span title='Elements missed'>m</span>" },
                              { "sTitle" : "<span title='Coverage Rate'>%</span>" },
                              { "sTitle" : "<span title='Number of lines'>Nl</span>" },
                              { "sTitle" : "<span title='Lines missed'>ml</span>" },
                              { "sTitle" : "<span title='Coverage rate'>%l</span>" },
                              { "sTitle" : "<span title='Missed range'>Between</span>",
                                "bSortable" : false
                              }
                            ],
                bPaginate : false,
                bFilter : false,
                bInfo : false,
                bAutoWidth : false 
            } );
            table.fnSort( [ [2,'desc'], [0,'asc'] ] );
            return this;
        },
        buildTableData : function() {
            var result = [];
            this.model.forEach( function( srcModel ) {              
                var row = [];
                result.push( row );
                row.push( srcModel.get("src") );
                var srcData = srcModel.data();
                $.each( ["element", "line"], function( i, type ) {
                    var cd = srcData[type];
                    row.push( cd.count );
                    row.push( cd.missed );
                    row.push( cd.rate.toFixed( 2 ) );
                } );
                var lineMessage = "Ok";
                if ( srcData.element.firstLine ) {
                    lineMessage = srcData.element.firstLine 
                        + " - " + srcData.element.lastLine;
                }
                row.push( lineMessage );
            } );
            return result;
        }

    } );

    return DtView;

} );
