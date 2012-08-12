/*global define:false, jasmine:false */
define( ["../notBackbone", "../notUnderscore", "../notJQuery", "../widgets/Checkbox", "../lib/text!./lintCollectionTemplate.html" ], function( Backbone, _, $, Checkbox, lintCollectionSummaryTemplate ) {

// TODO
// Replace span with this div as banner
// don't use .css, use addClass( hidden ); in parent LintCollectionView.
// Supply classes for failing, working, running.


    /** 
     * View of a LintCollection that summarizes counts of passed and
     * failed.  Also includes a dumb little local model about whether
     * to show or hid passed lint items; a containing view may listen
     * to this.
     */  

    var filterTooltip = function( found ) {
        var map = found.filterMap;
        var result = "";
        $.each( ["custom", "lib", "default"], function( i, type ) {
            if ( map[type] ) {
                result += type + ":\n";
                $.each( map[type], function( j, src ) {
                    result += "  " + src + "\n";
                } );
            }
        } );
        return result;
    };

    var buildSummary = function( collection, toJson ) {
        toJson.finished = collection.finished();
        toJson.unfinished = collection.unfinished();
        toJson.length = collection.length;
        toJson.failed = collection.failed();
        toJson.passed = collection.passed();
        toJson.issueCount = collection.issueCount();
        // TODO out with you
        if ( collection.finderResults ) {
            var found = collection.finderResults[0];
            toJson.found = found;
            toJson.filterTooltip = filterTooltip( found );
        }
    };

    var TemplateText = "<span class='title'>JSLint:</span> <%= issueCount %> issue(s) in "
            + "<%= failed %> files out of <%= length %>. "
            + "<% if ( typeof( found ) !== 'undefined' ) { %>"
            + "<span title='<%= filterTooltip %>'>(<%= found.filtered.length %> filtered) </span>"
            + "<% }; %>";

    var View = Backbone.View.extend( {
        tagName: "div",
        className: "lintCollectionBanner",
        template: _.template( TemplateText ),
        // containing div may listen on this model to show/hide passing items
        showHideModel: new Checkbox.Model( {label: "Show passed" } ),
        showGlobalsModel: new Checkbox.Model( {label: "Show some globals" } ),
        initialize : function() {
            _.bindAll(this, 'render' );
            this.model.on('add', this.render);
            this.model.on('change', this.render );

            var cbox = new Checkbox.View( { model: this.showHideModel } )
                    .render();
            var label = new Checkbox.Label( { model: this.showHideModel, 
                                              label: "Show passed" } )
                    .render();
            this.$el.append( $("<span />", {text:"JSLint: ...Loading..."} )
                             .addClass( "summary" ) );            
            this.$el.append( cbox.$el );
            this.$el.append( label.$el );

            var globalBox = new Checkbox.View( { model: this.showGlobalsModel, label:"Show globals" } ).render();
            var globalLabel = new Checkbox.Label( { model: this.showGlobalsModel,
                                                    label: "Show globals" } ).render();
            this.$el.append( globalBox.$el );
            this.$el.append( globalLabel.$el );
            this.$el.addClass( "running" );
        },
        render: function() {
            var self = this;
            var data = {}; //this.model.toJSON();
            buildSummary( this.model, data );

            this.$el.children( ".summary" ).html( this.template( data ));
            var clazz = "running";
            if ( data.unfinished === 0 ) {
                if ( data.length > data.passed ) {
                    clazz = "failed";
                }
                else {
                    clazz = "passed";
                }
            }
            $.each( ["running", "failed", "passed"], function( i, x ) {
                if ( clazz !== x  ) {
                    self.$el.removeClass( x );
                }
            } );
            this.$el.addClass( clazz );
            var globals = self.model.globals();
            var vars = _.keys( globals ) || [];
            self.showGlobalsModel.set("label", "Show " + vars.length + " globals" );

            return this;
        }
    });

    return View;

} );
