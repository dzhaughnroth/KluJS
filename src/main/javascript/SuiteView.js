/*globals define:false, $$_l:false */
define( [ "backbone", "underscore", "jquery", "./SuiteAssembly", "./lint/LintCollectionView", "./coverage/CoverageDataView", "./JasmineDivReporter" ], function( Backbone, _, $, SuiteAssembly, LintCollectionView, CoverageDataView, JasmineDivReporter ) {

    var SuiteView = Backbone.View.extend( {
        tagName : "div",
        initialize : function() {
            _.bindAll( this, "render" );
            var assembly = this.model;
            this.jasmineView = new JasmineDivReporter( this.model.jasmine );
            this.lintView = new LintCollectionView( { 
                model : assembly.lint } );
            this.coverageView = new CoverageDataView( { 
                model : assembly.coverage } );
        },
        render : function() {
            this.$el.append( this.lintView.render().$el );
            this.$el.append( this.coverageView.render().$el );
            return this;
        }

    } );

    return SuiteView;

} );

        
      


