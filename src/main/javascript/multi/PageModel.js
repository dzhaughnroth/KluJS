/*global define:false, window:false, klujs:false */
define( [ "./ChildFrameCollection", "../lint/LintCollection", "../coverage/CoverageDataModel", "../coverage/CoverageDataAggregator", "backbone", "jquery", "underscore" ], function( ChildFrameCollection, LintCollection, CoverageDataModel, CoverageDataAggregator, Backbone, $, _ ) {

    var PageModel = Backbone.Model.extend( {
        defaults: {
            config: klujs,
            done : false
            // frameDiv, a div containing the iframes for suites.
        },
        initialize: function() {
            var self = this;
            this.childFrames = new ChildFrameCollection.Model();
            this.childFrames.on( 'add', function( frameModel ) {
                self.get( "frameDiv" ).append( frameModel.frame );
            } );

            this.lintModel = new LintCollection();
            this.lintModel.on( 'add', function( modelAdded ) {
                modelAdded.check();
            } );
            $.each( self.get("config").suites, function( name, array ) {
                self.childFrames.add( {suite:name} );
            } );
            this.coverageDataModel = new CoverageDataModel.ProjectModel();
            this.on( 'change:done', function( ) {
                if ( self.get( "done" ) === true ) {
                    self.aggregateCoverage();
                }
            } );
        },
        check: function() {
            var self = this;
            var done = true;
            this.childFrames.forEach( function( x ) {
                x.check();
                done = done && (x.get("status") !== "running");
            } );
            if ( done ) {
                self.set( "done", true );
            }
        },        
        lintFound : function( lf ) {
            this.lintModel.addFinderResult( lf );
        },
        coverageData: function() {
            var self = this;           
            var result = [];
            self.childFrames.forEach( function( cf ) {
                result.push( cf.plainFrame.contentWindow.$$_l );
            } );
            return result;
            
        },
        aggregateCoverage: function() {
            var data = this.coverageData();
            var aggregate = CoverageDataAggregator( data );
            this.coverageDataModel.setData( aggregate );
        }
    } );
    return PageModel;

} );
