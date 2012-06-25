/*global define:false, jasmine:false */
define( ["../lib/notBackbone", "../lib/notUnderscore", "jquery", "./LintView", "./LintCollectionSummaryView" ], function( Backbone, _, $, LintView, LintCollectionSummaryView ) {

    var LintCollectionView = Backbone.View.extend( {
        tagName:"div",
        className:"lintCollectionView",
        initialize : function() {
            _.bindAll(this, 'render', 'addModel', 'add', 'adjustPassedVisibility' );
            this.model.on('add', this.add);
            var summaryView = new LintCollectionSummaryView( { model:this.model } );
            this.showHideModel = summaryView.showHideModel;
            this.showHideModel.on( 'change', this.adjustPassedVisibility );
            this.model.on( 'change', this.adjustPassedVisibility );
            this.$el.append( summaryView.$el );
        },
        adjustPassedVisibility: function( ) {
            var show = this.showHideModel.get("checked");
            var selection = this.$el.find( ".lintItem.passed" );
            if ( show ) {
                selection.removeClass( "hidden" );
            }
            else {
                selection.addClass( "hidden" );
            }
        },
        addModel: function( lModel ) {
            var lView = new LintView( { model: lModel } );
            lView.render();
            this.$el.append( lView.$el );
            this.adjustPassedVisibility();
        },
        add: function( event, coll, options ) {
            this.addModel( event );
        },
        render: function() {
            var am = this.addModel;
            this.model.each( function( lintModel ) {
                am( lintModel );
            } );
            return this;
        }
    });

    return LintCollectionView;

} );
