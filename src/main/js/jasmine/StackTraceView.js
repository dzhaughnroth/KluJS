/*global define:false, jasmine:false */
define( [ "../notJQuery", "../notUnderscore", "../notBackbone"], function( $, _, Backbone ) {

    var klujsRegex = /\/KluJS\//;
    var StackTraceView = Backbone.View.extend( {
        tagName : "div",
        className : "stackTrace",
        toggleShowFullTrace : function() {
            this._showFull = ! this._showFull;
            var items = this.$el.find( ".klujsTraceLine" );
            if ( this._showFull ) {
                items.removeClass( "hidden" );
            }
            else {
                items.addClass( "hidden" );
            }
        },
        initialize : function() {
            _.bindAll( this, "toggleShowFullTrace", "render" );
            this._showFull = false;
        },
        render : function() {
            var self = this;
            this.$el.empty();
            var trace = this.model;
            if ( trace ) {
                var ul = $("<ul />").appendTo( this.$el );
                var lines = trace.split( "\n" );
                $.each( lines, function( i, line ) {
                    if ( i > 0 ) {
                        var li = $("<li />", { text:line } ).appendTo( ul );
                        if ( klujsRegex.test( line ) ){
                            li.addClass( "klujsTraceLine" );
                            if ( ! self._showFull ) {
                                li.addClass("hidden");
                            }
                        }
                    }
                } );                
            }            
            return this;
        }

    } );

    return StackTraceView;
} );
