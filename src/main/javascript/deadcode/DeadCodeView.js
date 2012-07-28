/*global define:false, jasmine:false*/
define( [ "../lib/notBackbone", "../lib/notUnderscore", "jquery" ], function( Backbone, _, $ ) {


    var DeadCodeView = Backbone.View.extend( {
        tagName : "div",
        className : "deadCodeView",
        initialize : function() {
            _.bindAll( this, "render" );
            var self = this;
            $("<div />", {text:"Dead Code"} )
                .addClass( "deadCodeBanner" )
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
                report.text( deadCode.join( "; " ) );
                if ( deadCode.length > 0 ) {
                    banner.removeClass( "passed" );
                    banner.addClass( "failed" );
                }
                else {
                    report.text( "All Ok." );
                    banner.removeClass( "failed" );
                    banner.addClass("passed");
                }
            }            
            // display error?
            return this;
        }
    } );

    return DeadCodeView;

} );
