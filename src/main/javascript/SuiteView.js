/*globals define:false, $$_l:false */
define( [ "./lib/notBackbone", "./lib/notUnderscore", "jquery", "./SuiteAssembly", "./lint/LintCollectionView", "./coverage/CoverageDataView", "./JasmineDivReporter", "./SuiteName", "./FocusFilterFactory" ], function( Backbone, _, $, SuiteAssembly, LintCollectionView, CoverageDataView, JasmineDivReporter, SuiteName, FocusFilterFactory ) {

    var filterFactory = new FocusFilterFactory();
    var computeFocusFilter = function( suiteName ) {
        return filterFactory.create( suiteName );
    };

    var SuiteView = Backbone.View.extend( {
        tagName : "div",
        initialize : function() {
            var self = this;
            _.bindAll( this, "render" );
            var assembly = this.model;
            this.jasmineView = new JasmineDivReporter( assembly.jasmine );
            this.nameView = new SuiteName.View( {model:assembly.name} );
            this.lintView = new LintCollectionView( { 
                model : assembly.lint } );
            this.coverageView = new CoverageDataView( { 
                model : assembly.coverage,
                label : "Global code coverage" 
            } );
            this.focusView = new CoverageDataView( {
                model : assembly.coverage,
                label : "Focused code coverage"
            } );
            assembly.name.on( "change", function() {
                var filter = computeFocusFilter( assembly.name.get( "suiteName" ));
                self.focusView.options.filter = filter;
            } );
        },
        render : function() {
            this.$el.append( this.nameView.render().$el );
            this.$el.append( this.jasmineView.$el );
            this.$el.append( this.lintView.render().$el );
            this.$el.append( this.focusView.render().$el );
            this.$el.append( this.coverageView.render().$el );
            return this;
        }

    } );

    return SuiteView;

} );

        
      


