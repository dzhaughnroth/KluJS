/*global define:false, jasmine:false*/
define( [ "../goals/CoverageGoalInterpreter", "../lib/notBackbone", "../lib/notUnderscore", "../notJQuery" ], function( CoverageGoalInterpreter, Backbone, _, $ ) {
    var magicValue = function( row ) {
        // Hack to enable passing of rich data to datatable plugin
        // Issue is fnRender overwrites values sent to fnCellCreate,
        // and fnCellCreate only gets row values, not data values.
        // see buildData below for why it is 8 and not something else.
        return row[8]; 
    };

    var decorateForGoal = function( htmlEl, val, fail, msg ) {       
        var x = $(htmlEl);
        x.attr( "title", msg );
        if ( fail ) {
            x.addClass("coverageGoalFailed");
        }
    };

    var goalMsg = function( minOrMax, hasVal, targetVal, rules ) {
        var result = "Any";
        if ( hasVal ) {
            result = minOrMax + " of " + targetVal;
            if ( rules.length > 0) {
                result += " from " + rules.join(",");
            }
        }
        return result;
    };
    

    var decorateMissed = function( htmlEl, subData ) {
        decorateForGoal( htmlEl, subData.missed, !subData.maxOk(), 
                         goalMsg( "max", subData.hasMax(), subData.max, subData.rules ) );
    };

    var decorateRate = function( htmlEl, subData ) {
        decorateForGoal( htmlEl, subData.rate.toFixed(2), !subData.minOk(), 
                         goalMsg( "min", subData.hasMin(), subData.min, subData.rules ) );
    };


    var DtView = Backbone.View.extend( {
        tagName : "div",
        className : "coverageDataView",
        initialize : function() {
            _.bindAll( this, "render", "buildTableData" );
            var self = this;
            this.model.on( "change", function() {
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
            var self = this;
            var useGoals = !this.options.disableGoals;
            this.$el.empty();
            var banner = $( "<div />" )
                    .addClass( "coverageBanner" )
                    .appendTo( this.$el );
            $("<span />", { text: this.options.label } )
                .addClass( "coverageTitle" )
                .appendTo( banner );
            $("<button />", {text:"node-coverage", disabled:true} )
                .appendTo( banner );
            if( this.model.get("noData") ) {
                this.$el.append( $( "<div />", { text: "No coverage data" } )
                                 .addClass( "coverageStatusMessage" )  );
                return this;
            }
            if( ! this.model.calculator ) {
                this.$el.append( $( "<div />", { text: "Pending..." } )
                                 .addClass( "coverageStatusMessage" ) 
                               );
                return this;
            }
            var table = $( "<table />", { } )
                    .addClass("coverageTable")
                    .addClass("display")
                    .appendTo( this.$el );
            var data = this.buildTableData();
            
            table.dataTable( {
                aaData : data,
                aoColumns : [ { sTitle: "File" },
                              { sTitle : "<span title='Number of elements'>N</span>" },
                              { sTitle : "<span title='Elements missed'>m</span>",
                                fnCreatedCell : function( el, val, row ) {
                                    if (useGoals) {
                                        decorateMissed( el, magicValue(row).element );
                                    }
                                }
                               },
                              { sTitle : "<span title='Coverage Rate'>%</span>",
                                fnCreatedCell : function( el, val, row ) {
                                    if ( useGoals ) { 
                                        decorateRate( el, magicValue(row).element );
                                    }
                                }
                               },
                              { sTitle : "<span title='Number of lines'>Nl</span>" },
                              { sTitle : "<span title='Lines missed'>ml</span>",
                                fnCreatedCell : function( el, val, row ) {
                                    if ( useGoals ) { 
                                        decorateMissed( el, magicValue(row).line);
                                    }
                                }
                              },
                              { sTitle : "<span title='Coverage rate'>%l</span>",
                                fnCreatedCell : function( el, val, row ) {
                                    if ( useGoals ) { 
                                        decorateRate( el, magicValue(row).line );
                                    }
                                }
                              },
                              { sTitle : "<span title='Missed range'>Between</span>",
                                bSortable : false }
                            ],
                bPaginate : false,
                bFilter : false,
                bInfo : false,
                bAutoWidth : false 
            } );
            table.fnSort( [ [0,'asc'] ] );
            if ( useGoals ) {
                var goalFailureCount = self.model.goalFailureCount( this.options.filter );
                var msg = "All " + data.length + " goals met";
                if ( goalFailureCount ) {
                    msg = goalFailureCount + " of " + data.length + " goals unmet";
                    banner.addClass( "coverageGoalFailed" );
                }
                else {
                    banner.addClass( "allCoverageGoalsPassed" );
                }
                
                $("<span />", {text: msg } )
                    .appendTo( banner );
            }

            return this;
        },
        buildTableData : function() {
            var self = this;
            var result = [];
            var vals = _.values( this.model.byFile );
            var filtered = _.filter( vals, this.options.filter );
            filtered.forEach( function( sum ) {
                var row = [];
                result.push( row );
                row.push( sum.src );
                $.each( ["element", "line"], function( i, type ) {
                    var cd = sum[type];
                    row.push( cd.count );
                    row.push( cd.missed );
                    row.push( cd.rate.toFixed( 2 ) );
                } );
                var elementRangeMessage = "Ok";
                if ( sum.data.element.firstLine ) {
                    elementRangeMessage = sum.data.element.firstLine 
                        + " - " + sum.data.element.lastLine;
                }
                row.push( elementRangeMessage );
                // this is what determines the magic value index; here, 8
                if ( self.options.disableGoals ) {
                    row.push( { line : { }, element: { } } );
                } else {
                    row.push( sum );
                }
            } );
            return result;
        }

    } );

    return DtView;

} );
