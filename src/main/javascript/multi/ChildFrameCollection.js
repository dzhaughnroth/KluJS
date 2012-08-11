/*global jasmineGradle: true, $: false, define:false */
define( ["./ChildFrameModel", "./ChildFrameView", "../notBackbone", "../notJQuery", "../notUnderscore"], function(ChildFrameModel,ChildFrameView, Backbone, $, _) {

    var Model = Backbone.Collection.extend( {
        model : ChildFrameModel,
        passed : function() {
            return this.filter( function( x ) { return x.get("status") === "passed"; } );
        },
        failed : function() {
            return this.filter( function( x ) { return x.get("status") === "failed"
                                                || x.get("status") === "error"; } );
        },
        running: function() {
            return this.filter( function( x ) { return x.get("status") === "running"; } );
        },
        isDone: function() {
            return this.running().length === 0;
        },
        isFailing: function() {
            return this.failed().length > 0;
        },
        summarize : function() {
            var result = {};
            this.forEach( function( x ) {
                var deadCode = x.get("deadCodeResult");                
                var deadFailures = 0;
                if( deadCode ) {
                    deadFailures = deadCode.dead.length + deadCode.undead.length;
                }                
                result[x.get("suite")] = {
                    status: x.get("status"),
                    coverageGoalFailures: x.get("coverageGoalFailures"),
                    deadCodeFailures : deadFailures
                };
            } );
            return result;
        }
    } );

    var TableView = Backbone.View.extend( {
        tagName: "table",
        className: "childFrameTable",
        model: Model,
        initialize: function() {
            _.bindAll( this, "render" );
            var header = $( "<tr />" )
                    .append( $( "<th />", {text: "Suite" } ) )
                    .append( $( "<th />", {text: "Results"} ) )
                    .append( $( "<th />", {text: "Coverage" } ) )
                    .append( $( "<th />", {text: "Dead code" } ) );
            this.header = $( "<thead />" ).append( header );
            this.tbody = $( "<tbody />" );
            this.$el.append( this.header );
            this.$el.append( this.tbody );
            this.model.on( "add", this.render );
        },
        subviews : {},
        render: function() {
            var self = this;
            this.model.forEach( function( childModel ) { 
                if ( ! self.subviews[childModel.get("suite")] ) {
                    var cell = new ChildFrameView( { model:childModel } ).render();
                    self.subviews[childModel.get("suite")] = cell;
                    self.tbody.append( cell.$el );                   
                }
            } );
            return this;
        }
    } );

    var SummaryView = Backbone.View.extend( {
        tagName: "div",
        className: "childFrameSummary",
        model: Model,
        initialize: function() {
            _.bindAll( this, "render" );
            this.model.on( "change", this.render );
            this.model.on( "add", this.render );
        },
        subviews : {},
        render: function() {
            var self = this;
            var data = {
                running: self.model.running().length,
                failed: self.model.failed().length,
                count: self.model.length,
                passed: self.model.passed().length                
            };
            // TODO
            this.$el.text( data.failed + " of " + data.count + " suites failed (" 
                           + data.running + " running)" );
            if ( data.running > 0 || data.count === 0 ) {
                this.$el.addClass( "running" );
            }
            else {
                this.$el.removeClass( "running" );
            }
            if ( data.failed > 0 ) {
                this.$el.addClass( "failed" );
            }
            else {
                this.$el.removeClass( "failed" );
            }
               
            return this;
        }
    } );

    var CompositeView = Backbone.View.extend( {
        tagName: "div",
        className: "childFrameContainer",
        initialize: function() {
            this.summaryView = new SummaryView( { model: this.model } );
            this.tableView = new TableView( { model: this.model } );
            this.$el.append( this.summaryView.$el );
            this.$el.append( this.tableView.$el );
        },
        render: function() {
            this.summaryView.render();
            this.tableView.render();
            return this;
        }
    } );

    return {
        Model:Model,
        TableView:TableView,
        SummaryView:SummaryView,
        CompositeView:CompositeView
    };

} );


