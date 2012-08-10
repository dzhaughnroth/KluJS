/*global define:false, jasmine:false */
define( ["../notJQuery", "../notBackbone", "../notUnderscore", "./LintView", "./LintCollectionSummaryView", "./GlobalVariableView" ], function( $, Backbone, _, LintView, LintCollectionSummaryView, GlobalVariableView ) {

    var LintCollectionView = Backbone.View.extend( {
        tagName:"div",
        className:"lintCollectionView",
        initialize : function() {
            _.bindAll(this, 'render', 'addModel', 'add', 'adjustPassedVisibility', "adjustGlobalsVisibility" );
            this.model.on('add', this.add);
            var summaryView = new LintCollectionSummaryView( { model:this.model } );
            var globalVariableView = new GlobalVariableView( { model:this.model } );
            this.showHideModel = summaryView.showHideModel;
            this.showHideModel.on( 'change', this.adjustPassedVisibility );
            this.showGlobalsModel = summaryView.showGlobalsModel;
            this.showGlobalsModel.on( 'change', this.adjustGlobalsVisibility );
            this.model.on( 'change', this.adjustPassedVisibility );
            this.$el.append( summaryView.$el );
            this.$el.append( globalVariableView.$el );            
            this.adjustGlobalsVisibility();
        },
        adjustGlobalsVisibility: function() {
            var selection = this.$el.find( ".lintGlobalVariableReport" );
            if ( this.showGlobalsModel.get("checked") ) {
                selection.removeClass( "hidden" );
            }
            else {
                selection.addClass( "hidden" );
            }
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
            var addMethod = this.addModel;
            this.model.each( function( lintModel ) {
                addMethod( lintModel );
            } );
            return this;
        }
    });

    return LintCollectionView;

} );
