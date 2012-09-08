/*global define:false, jasmine:false */
define( [ "../notJQuery", "../notUnderscore", "../notBackbone", "./SuiteView" ], function( $, _, Backbone, SuiteView ) {

    // Colored banner for a RunnerModel
    var TreeRunnerView = Backbone.View.extend( {
        tagName : "div",
        className : "jasmineTreeView",
        initialize : function() {
            _.bindAll( this, "render" );
            this.model.on( "change", this.render );
        },
        render : function() {
            var self = this;
            var status = this.model.get("status");
            var runner = this.model.get("runner");
            this.$el.addClass( status );
            if ( runner && !this.suitesRendered ) {
                this.suitesRendered = true;
                $.each( this.model.suiteModels, function( i, suiteModel ) {
                    var suiteView = new SuiteView( { model : suiteModel } );
                    suiteView.autoHide = false;
                    suiteView.render();
                    self.$el.append( suiteView.$el );
                } );
            }
            return this;
        }
        
    } );

    return TreeRunnerView;
    
} );
