/*global define:false, jasmine:false */
define( [ "../notJQuery", "../notUnderscore", "../notBackbone", "./SpecToText"], function( $, _, Backbone, SpecToText ) {

    var View = Backbone.View.extend( {
        tagName: "div",
        className : "jasmineSpecView",
        autoHide : true,
        initialize : function() {
            _.bindAll( this, "render", "setText" );
            this.model.on( "change", this.render );
            this.titleEl = this.$el;
            this.$el.addClass( "itemTitle" );
        },
        updates : {
            skippedUpdate : function() {
                this.$el.addClass( "skipped" );
                this.$el.removeClass( "passed" );
                this.$el.removeClass( "error" );
                this.$el.removeClass( "failed" );
                this.$el.removeClass( "running" );
            },
            passedUpdate : function() {
                this.$el.addClass( "passed" );
                this.$el.removeClass( "failed" );
                this.$el.removeClass( "error" );
                if ( this.autoHide ) {
                    this.$el.addClass( "hidden" );
                }
                else {
                    this.$el.removeClass( "hidden" );
                }
                this.setText( "passed" );
            },        
            failedUpdate : function() {
                this.$el.addClass( "failed" );
                this.$el.removeClass( "passed" );
                this.$el.removeClass( "hidden" );
                var s = this.model.get("spec");
                var r = s.results();
                var failures = _.filter( r.getItems(), 
                                         function(item) { return !item.passed(); } 
                                       );
                var text = failures.length + "/" + r.getItems().length + " failed";          
                this.setText( text );
            },
            runningUpdate : function() {
                this.setText("");
            },
            errorUpdate : function() {
                this.setText("Error");
                this.$el.addClass( "error" );
                this.$el.removeClass( "passed" );
                this.$el.removeClass( "failed" );
                this.$el.removeClass( "hidden" );
            }
        },
        setText: function(extraText) {
            var link = SpecToText.link( this.model.get("spec"), SpecToText.brief( this.model.get("spec") ) );
            var extra = "";
            if ( extraText ) {
                extra = ": " + extraText;
            }
            this.titleEl.empty()
                .append( link )
                .append( $("<span />", { text : extra } ) );
        },
        render : function() {
            var status = this.model.get("status");
            var methodName = status + "Update";
            var update = this.updates[methodName];
            if ( update ) {
                update.call( this );
            }
            else {
                this.setText( "loading" );
            }
            return this;
        }

    } );

    return View;
    
} );
