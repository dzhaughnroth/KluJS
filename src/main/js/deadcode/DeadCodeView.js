/*global define:false, jasmine:false*/
define( [ "../notBackbone", "../notUnderscore", "../notJQuery" ], function( Backbone, _, $ ) {


    var DeadCodeView = Backbone.View.extend( {
        tagName : "div",
        className : "deadCodeView",
        initialize : function() {
            _.bindAll( this, "render" );
            var self = this;
            $("<div />", {text:"Dead Code"} )
                .addClass( "deadCodeBanner" )
                .addClass( "banner" )
                .appendTo( self.$el );
            $("<div />", {text:"Pending..."} )
                .addClass( "deadCodeReport" )
                .appendTo( self.$el );
            this.model.on( "change", function() {
                self.render( );
            } );
        },
        render : function() {
            var banner = this.$el.find( ".deadCodeBanner" );
            var report = this.$el.find( ".deadCodeReport" );
            var deadCode = this.model.get("deadCode");
            if ( typeof deadCode !== "undefined" ) {
                report.empty();                
                var ul = $("<ul />").appendTo( report );
                $.each( deadCode, function( type, coll ) {
                    $.each( coll, function( i, x ) {
                        $("<li />", {text:x})
                            .addClass( type )
                            .appendTo( ul );
                    } );
                } );
                var notOk = (deadCode.dead && deadCode.dead.length > 0)
                        || (deadCode.undead && deadCode.undead.length > 0 );
                if ( !notOk ) {                    
                    banner.removeClass( "failed" );
                    banner.addClass("passed");
                }
                else {
                    banner.removeClass( "passed" );
                    banner.addClass( "failed" );
                }
            }            
            return this;
        }
    } );

    return DeadCodeView;

} );
