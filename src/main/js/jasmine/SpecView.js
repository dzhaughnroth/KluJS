/*global define:false, jasmine:false */
define( [ "../notJQuery", "../notUnderscore", "../notBackbone"], function( $, _, Backbone ) {

    var fullDescription = function( spec ) {
        return spec.description;
    };

    var View = Backbone.View.extend( {
        tagName: "div",
        className : "jasmineSpecView",
        autoHide : true,
        initialize : function() {
            _.bindAll( this, "render" );
            this.model.on( "change", this.render );
            this.titleEl = this.$el;
        },
        updates : {
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
                this.$el.text( fullDescription( this.model.get("spec" ) ) 
                               + " passed");
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
                var text = fullDescription(s) + ": " + failures.length + "/" + r.getItems().length + " failed";                      
                this.titleEl.text( text );
            },
            runningUpdate : function() {
                this.titleEl.text( fullDescription( this.model.get("spec") ) );
            },
            errorUpdate : function() {
                this.$el.addClass( "error" );
                this.$el.removeClass( "passed" );
                this.$el.removeClass( "failed" );
                this.$el.removeClass( "hidden" );
                this.titleEl.text( this.titleEl.text() + ": Error" );
            }
        },
        render : function() {
            var status = this.model.get("status");
            var methodName = status + "Update";
            var update = this.updates[methodName];
            if ( update ) {
                update.call( this );
            }
            else {
                this.titleEl.text( "...loading..." );
            }
            return this;
        }

    } );

    return View;
    
} );
