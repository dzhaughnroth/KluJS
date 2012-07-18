/*global define:false, jasmine:false*/
define( [ "./CoverageDataTallyer", "../goals/CoverageGoalInterpreter", "../lib/notBackbone", "../lib/notUnderscore", "jquery", "../lib/jquery.datatables.min" ], function( tally, CoverageGoalInterpreter, Backbone, _, $ ) {
    var decorateForPassFail = function( htmlEl, val, targets, isMin ) {
        
        var x = $(htmlEl);
        if ( typeof targets.rules !== "undefined" ) {
            var fail;
            var targetVal;
            if ( isMin ) {
                targetVal = targets.min;
                fail = val < targets.min;
            }              
            else {
                targetVal = targets.max;
                fail = val > targets.max;
            }
            var msg = "Any";
            if( typeof targetVal !== "undefined" ) {
                if ( fail ) {
                    x.addClass("coverageGoalFailed");
                }
                msg = (isMin ? "min" : "max") + " of " + targetVal;
                if ( targets.rules.length > 0 ) {
                    msg += " from " +targets.rules.join(",");
                }
            }
            else {
                msg = "Any";
            }
            x.attr( "title", msg );
        }
        else {
            x.attr( "title", "Any" );
        }
    };
    var DtView = Backbone.View.extend( {
        tagName : "div",
        className : "coverageDataView",
        initialize : function() {
            _.bindAll( this, "render", "buildTableData" );
            var self = this;
            this.model.on( "reset", function() {
                self.render( );
            } );
            if ( ! this.options.filter ) {
                this.options.filter = function( x ) {
                    return true;
                };
            }
            if( ! this.options.label ) {
                this.options.label = "Code coverage";
            }

        },
        render : function() {
            this.$el.empty();
            var msg;
            try {
                var tallies = tally( this.model, this.options.filter );
                msg = "Missed " + tallies.line.missed + " of " + tallies.line.count
                    + " lines (" + tallies.line.rate().toFixed( 2 ) + " covered) and " +
                    tallies.element.missed + " of " + tallies.element.count + 
                    " elements (" + tallies.element.rate().toFixed( 2 ) + " covered.)";
            }
            catch( ex ) {
                msg = "Totals failed: " + ex;
            }

            var banner = $( "<div />" )
                    .addClass( "coverageBanner" )
                    .appendTo( this.$el );
            $("<span />", { text: this.options.label } )
                .addClass( "coverageTitle" )
                .appendTo( banner );
            $("<button />", {text:"node-coverage", disabled:true} )
                .appendTo( banner );
            $("<span />", {text: msg } )
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
                              { "sTitle" : "<span title='Elements missed'>m</span>",
                                "fnCreatedCell" : function( el, val, row ) {
                                    decorateForPassFail( el, val, row[8].element);
                                }
                               },
                              { "sTitle" : "<span title='Coverage Rate'>%</span>",
                                "fnCreatedCell" : function( el, val, row ) {
                                    decorateForPassFail( el, val, row[8].element, true );
                                }
                               },
                              { "sTitle" : "<span title='Number of lines'>Nl</span>" },
                              { "sTitle" : "<span title='Lines missed'>ml</span>",
                                "fnCreatedCell" : function( el, val, row ) {
                                    decorateForPassFail( el, val, row[8].line );
                                }
                              },
                              { "sTitle" : "<span title='Coverage rate'>%l</span>",
                                fnCreatedCell : function( el, val, row ) {
                                    decorateForPassFail( el, val, row[8].line, true );
                                }
                              },

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
            var self = this;
            var result = [];
            var filtered = this.model.filter( this.options.filter );
            filtered.forEach( function( srcModel ) {
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
                var goalThresholds = {
                    line : {
                    },
                    element: {
                    }
                };
                if ( self.options.goals ) {
                    var lineGoal = self.options.goals.lineGoal( srcModel.get( "src" ) );
                    var elGoal = self.options.goals.elementGoal( srcModel.get("src" ));
                    
                    goalThresholds.line.max = lineGoal.max;
                    goalThresholds.line.min = lineGoal.min;
                    goalThresholds.element.max = elGoal.max;
                    goalThresholds.element.min = elGoal.min;
                    
                    goalThresholds.line.rules = lineGoal.exceptionRules;
                    goalThresholds.element.rules = elGoal.exceptionRules;
                }
                row.push( goalThresholds );
            } );
            return result;
        }

    } );

    return DtView;

} );
