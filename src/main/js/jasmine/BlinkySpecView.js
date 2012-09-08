/*global define:false, jasmine:false */
define( [ "../notJQuery", "../notUnderscore", "../notBackbone"], function( $, _, Backbone ) {

    var classesToSymbol = {"passed":".", "failed":"!", "error":"?", 
                           "running":"-", "new":"*" };
    var BlinkySpecView = Backbone.View.extend( {
        tagName : "span",
        className : "specBlinker",
        initialize : function() {
            _.bindAll( this, "render" );
            this.model.on( "change", this.render );
        },
        render : function() {
            var self = this;
            var status = this.model.get("status");
            $.each( classesToSymbol, function( stat, text ) {
                if ( stat === status ) {
                    self.$el.addClass( stat );
                    self.$el.text(text);
                }
                else {
                    self.$el.removeClass( stat );
                }
            } );
            return this;
        }
    } );

    return BlinkySpecView;    

} );
