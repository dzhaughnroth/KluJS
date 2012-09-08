/*global define:false, jasmine:false */
define( [ "./FailedSpecView", "../notJQuery", "../notUnderscore", "../notBackbone"], function( FailedSpecView, $, _, Backbone ) {

    var FailedSpecsRunnerView = Backbone.View.extend( {
        tagName: "div",
        className : "jasmineFailedSpecsRunnerView",
        initialize : function() {
            _.bindAll( this, "render" );
            this.model.on( "change", this.render );
        },
        render : function() {
            var self = this;
            var runner = this.model.get("runner");
            if ( runner && this.model.get("status" ) === "failed" ) {
                this.$el.empty();
                $.each( this.model.specMap, function( id, specModel ) {
                    if ( specModel.get("status") !== "passed" ) {
                        var subView = new FailedSpecView( { model:specModel } ).render();
                        self.$el.append( subView.$el );                       
                    }
                } );
            }
            return this;
        }

    } );

    return FailedSpecsRunnerView;
    
} );
