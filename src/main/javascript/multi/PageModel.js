/*global define:false, window:false */
define( [ "./ChildFrameCollection", "../lint/LintCollection", "../coverage/CoverageDataModel", "../coverage/CoverageDataAggregator", "../deadcode/CodeListModel", "../deadcode/DeadCodeModel", "../lib/notBackbone", "jquery", "../lib/notUnderscore", "../Config" ], function( ChildFrameCollection, LintCollection, CoverageDataModel, CoverageDataAggregator, CodeListModel, DeadCodeModel, Backbone, $, _, notKlujs ) {

    var log = function( msg ) {
        // console.log( msg );
    };

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
            this.lintModel.on( 'change', function() {
                log( "Unfinished: " + self.lintModel.unfinished() );
                if ( self.lintModel.unfinished() === 0 ) {                    
                    self.set( "lintDone", true );
                    log( "lintDone" );
                }
            } );

            this.lintQueue = [];
            this.codeListModel = new CodeListModel( );
            this.codeListModel.fetch();
            this.coverageDataModel = new CoverageDataModel();
            this.deadCodeModel = new DeadCodeModel( {
                coverageDataModel : self.coverageDataModel,
                codeListModel: self.codeListModel,
                exceptions: notKlujs.deadCode()
            } );
            this.on( 'change:testDone', function( ) {
                if ( self.get( "testDone" ) === true ) {
                    self.aggregateCoverage();
                    self.doLint();
                }
            } );
            this.on( 'change:lintDone', function() {
                self.set("done", true );
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
            this.lintQueue.push( lf );
            log( "q is " + this.lintQueue.length );
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
