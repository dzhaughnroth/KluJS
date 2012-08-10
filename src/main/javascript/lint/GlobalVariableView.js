/*global define:false, jasmine:false */
define( ["../notJQuery", "../notBackbone", "../notUnderscore" ], function( $, Backbone, _, LintView, LintCollectionSummaryView ) {

    var GlobalVariableView = Backbone.View.extend( {
        tagName:"div",
        className:"lintGlobalVariableReport",
        initialize : function() {
            _.bindAll(this, 'render' );
            this.model.on('change:lintData', this.render );
            this.model.on( 'change', this.adjustPassedVisibility );
            $("<div />", {text:"Global Variables"} ).appendTo( this.$el );
            this.ul = $("<ul />").appendTo( this.$el );
        },
        render: function() {
            var self = this;
            this.ul.empty();
            var globals = this.model.globals();
            $.each( globals, function( name, files ) {
                var title = files.join("\n");
                self.ul.append( $("<li />", {text: name +": " + files.length + " files.",
                                             title: title } ) );                
            } );
            return this;
        }
    });

    return GlobalVariableView;

} );
