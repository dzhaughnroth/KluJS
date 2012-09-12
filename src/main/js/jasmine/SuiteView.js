/*global define:false, jasmine:false */
define( [ "../notJQuery", "../notUnderscore", "../notBackbone", "./SpecView", "./SpecToText"], function( $, _, Backbone, SpecView, SpecToText ) {

    var SuiteView;
    SuiteView = Backbone.View.extend( {
        tagName: "div",
        className : "jasmineSuiteView",
        autoHide : true,
        initialize : function() {
            _.bindAll( this, "render" );
            this.model.on( "change", this.render );
            this.descriptionDiv = $("<div />", {text:"...loading..."})
                .addClass( "jasmineSuiteViewDescription" );
            this.$el.append( this.descriptionDiv );
        },
        render : function() {
            var self = this;
            var s = this.model.get("suite");
            var done = this.model.get("done");
            if ( s ) {
                self.$el.empty();
                self.$el.append( self.descriptionDiv );
                self.descriptionDiv.text( "" );
                self.descriptionDiv.append( SpecToText.link( s, s.description ) );
                $.each( this.model.specModels, function( i, specModel ) {
                    var specView = new SpecView( { model : specModel } );
                    specView.autoHide = this.autoHide;
                    specView.render();
                    self.$el.append( specView.$el );
                } );
                $.each( this.model.suiteModels, function( i, suiteModel ) {
                    var suiteView = new SuiteView( { model : suiteModel } );
                    suiteView.render();
                    self.$el.append( suiteView.$el );
                } );               
            }
            if ( done ) {
                // not state change per se; 
                // execpt autoHide if everything passed
                var r = s.results();
                self.$el.removeClass("hidden");
                if ( typeof r !== "undefined" ) {
                    if ( r.failedCount === 0 ) {
                        if( r.totalCount > 0 ) { 
                            if ( self.autoHide ) {
                                self.$el.addClass("hidden");
                            }
                        }
                    }
                }
            }
            return this;
        }

    } );

    return SuiteView;
    
} );
