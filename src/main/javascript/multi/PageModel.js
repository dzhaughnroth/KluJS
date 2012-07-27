/*global define:false, window:false */
define( [ "./ChildFrameCollection", "../lint/LintCollection", "../coverage/CoverageDataModel", "../coverage/CoverageDataAggregator", "../lib/notBackbone", "jquery", "../lib/notUnderscore" ], function( ChildFrameCollection, LintCollection, CoverageDataModel, CoverageDataAggregator, Backbone, $, _ ) {

    var PageModel = Backbone.Model.extend( {
        defaults: {
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
            this.lintQueue = [];
            this.coverageDataModel = new CoverageDataModel();
            this.on( 'change:testDone', function( ) {
                if ( self.get( "testDone" ) === true ) {
                    self.aggregateCoverage();
                    self.doLint();
                    self.set( "done", true );
                }
            } );
            var built = false;
            var buildChildren = function() {
                if ( !built ) {
                    built = true;
                    $.each( self.get("config").suiteNames(), function( i, name ) {
                        self.childFrames.add( {suite:name} );
                    } );
                }
            };
            if ( self.get( "config" ) ) {
                buildChildren();
            }
            else {
                this.on( "change:config", buildChildren );
            }
        },
        check: function() {
            var self = this;
            var done = true;
            this.childFrames.forEach( function( x ) {
                x.check();
                done = done && (x.get("status") !== "running");
            } );
            if ( done ) {
                self.set( "testDone", true );
            }
        },        
        lintFound : function( lf ) {
//            this.lintModel.addFinderResult( lf );
            this.lintQueue.push( lf );
        },
        doLint : function() {
            var self = this;
            $.each( this.lintQueue, function( i, lf ) {
                self.lintModel.addFinderResult( lf );
            } );
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
