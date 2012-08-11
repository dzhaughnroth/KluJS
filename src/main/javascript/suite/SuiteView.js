/*globals define:false, $$_l:false */
define( [ "../notBackbone", "../notUnderscore", "../notJQuery", "./SuiteAssembly", "../lint/LintCollectionView", "../coverage/CoverageDataView", "../jasmine/JasmineView", "../SuiteName", "../FocusFilterFactory", "../deadcode/DeadCodeView" ], function( Backbone, _, $, SuiteAssembly, LintCollectionView, CoverageDataView, JasmineView, SuiteName, FocusFilterFactory, DeadCodeView ) {

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
            this.jasmineView = new JasmineView( assembly.jasmine );
            this.nameView = new SuiteName.View( {model:assembly.name} );
            this.lintView = new LintCollectionView( { 
                model : assembly.lint } );
            this.coverageView = new CoverageDataView( { 
                model : assembly.coverage,
                label : "Global code coverage",
                disableGoals : true
            } );
            this.focusView = new CoverageDataView( {
                model : assembly.coverage,
                label : "Focused code coverage"
            } );
            this.deadCodeView = new DeadCodeView( {
                model : assembly.deadCode
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
            this.$el.append( this.deadCodeView.render().$el );
            this.$el.append( this.focusView.render().$el );
            this.$el.append( this.coverageView.render().$el );
            this.$el.append( $("<div />", {text: "Started at " + new Date() } ));
            return this;
        }

    } );

    return SuiteView;

} );

        
      


