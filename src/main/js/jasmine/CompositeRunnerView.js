/*global define:false, jasmine:false */
define( [ "../notJQuery", "../notUnderscore", "../notBackbone", "./BannerRunnerView", "./BlinkyRunnerView", "./TreeRunnerView", "./FailedSpecsRunnerView" ], function( $, _, Backbone, BannerRunnerView, BlinkyRunnerView, TreeRunnerView, FailedSpecsRunnerView ) {

    var CompositeRunnerView = Backbone.View.extend( {
        tagName : "div",
        className : "jasmineCompositeView",
        initialize : function() {
            var self = this;
            _.bindAll( this, "render" );
            this.bannerView = new BannerRunnerView( { model : self.model } ).render(); 
            var showAllModel = this.bannerView.showAllModel;
            showAllModel.on( "change", function() {
                if ( showAllModel.get("checked") ) {
                    self.treeView.$el.removeClass( "hidden" );
                }
                else {
                    self.treeView.$el.addClass( "hidden" );
                }
            } );

            this.blinkyView = new BlinkyRunnerView( { model : self.model } ).render();
            this.failView = new FailedSpecsRunnerView( { model:self.model} ).render();
            this.treeView = new TreeRunnerView( { model : self.model } ).render();
            this.treeView.$el.addClass("hidden");
            this.$el.append( this.bannerView.$el )
                .append( this.blinkyView.$el )
                .append( this.failView.$el )           
                .append( this.treeView.$el );
        },
        render : function() {            
            return this;
        }
    } );

    return CompositeRunnerView;
    
} );
