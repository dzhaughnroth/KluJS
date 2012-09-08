/*global define:false, jasmine:false */
define( [ "../notJQuery", "../notUnderscore", "../notBackbone", "./BlinkySpecView"], function( $, _, Backbone, BlinkySpecView ) {

    var RunnerBlinkyView = Backbone.View.extend( {
        // model is a RunnerOfJamsine.Model
        tagName : "div",
        className : "jasmineBlinkyView",
        initialize : function() {
            _.bindAll( this, "render", "createSpecView" );           
            this.model.on( "change", this.render );
            this.suitesRendered = false;
            this.listEl = $( "<div />" ).appendTo( this.$el )
                .addClass( "jasmineBlinkyViewList" );
            this.nameEl = $( "<div />" )
                .addClass( "jasmineBlinkyViewName" )
                .text( "...loading..." )
                .appendTo( this.$el );           
        },
        render : function() {
            var self = this;
            var runner = this.model.get("runner");
            if ( runner ) {
                this.nameEl.html( "&nbsp;" );
                this.listEl.empty();
                $.each( this.model.specMap, function( id, specModel ) {
                    self.listEl.append( self.createSpecView( specModel ).$el );
                } );
            }
            return this;
        },
        createSpecView : function( specModel ) {
            var self = this;
            var view = new BlinkySpecView( { model: specModel } ).render();
            view.$el.hover( function() {
                self.nameEl.text( specModel.fullDescription() );
            } );
            return view;
        }
    } );

    return RunnerBlinkyView;


    
} );
