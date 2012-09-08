/*global define:false, jasmine:false */
define( [ "../notJQuery", "../notUnderscore", "../notBackbone", "../widgets/Checkbox" ], function( $, _, Backbone, Checkbox ) {

    // Colored banner for a RunnerModel
    var BannerRunnerView = Backbone.View.extend( {
        tagName : "div",
        className : "jasmineBannerView",
        initialize : function() {
            var self = this;
            _.bindAll( this, "render" );
            this.textEl = $("<span />" ).appendTo( this.$el );
            this.textEl.text( "Jasmine: Loading" );
            var buttonEl = $("<span />").addClass( "showAll" );

            this.showAllModel = new Checkbox.Model( { label : "List specs" } );
            this.showAllLabel = new Checkbox.Label( { model: self.showAllModel } ).render();
            this.showAllButton = new Checkbox.View( {model: self.showAllModel } ).render();
            buttonEl.append( this.showAllButton.$el )
                .append( this.showAllLabel.$el );

            this.$el.append( buttonEl );
            this.$el.addClass("banner");
            this.model.on( "change", this.render );
            },
        render : function() {
            var status = this.model.get("status");
            var runner = this.model.get("runner");
            this.$el.addClass( status );
            if ( runner ) {
                var count = _.keys( this.model.specMap ).length;
                var text = "Jasmine: Running " + count + " specs";
                if ( this.model.get("done" ) ) {
                    this.$el.removeClass("running");
                    var results = runner.results();
                    if ( results.failedCount > 0 ) {
                        text = "Jasmine: " + results.failedCount + " of " 
                            + count + " specs failed";
                        this.$el.addClass( "failed" );
                        this.$el.removeClass( "passed" );
                    }
                    else {
                        text = "Jasmine: All " + count + " specs passed";
                        this.$el.addClass( "passed" );
                        this.$el.removeClass( "failed" );
                    }
                }
                this.textEl.text( text );
            }
            return this;
        }
        
    } );

    return BannerRunnerView;
    
} );
