/*globals define:false, $$_l:false, window:false */
define( [ 
    "./jasmine/JasmineModel",
    "./SuiteName",
    "./FocusFilterFactory",
    "./ParentMessagePoster",
    "./coverage/CoverageDataModel",
    "./goals/SuiteInterpreter",
    "./lint/LintFinder",
    "./lint/LintCollection",
    "./lib/notBackbone"
], function( JasmineModel, SuiteName, FocusFilterFactory, ParentMessagePoster, CoverageDataModel, SuiteInterpreter, LintFinder, LintCollection, Backbone ) {

    // optional args for testing; defaults to window, jasmine globals
    var Assembly = function( mockWindow, mockJasmine ) {
        var self = this;
        var parentPoster = new ParentMessagePoster( mockWindow );
        var postToParent = function( msg ) {
            return parentPoster.postToParent( msg );
        };
        var filterFactory = new FocusFilterFactory();
        this.filter = function() { return true; };
        this.name = new SuiteName.Model();
        var jasModel = new JasmineModel( { jasmineImpl:mockJasmine } );
        var lintModel = new LintCollection();
        lintModel.on( 'add', function( modelAdded ) {
            modelAdded.check();
        } );
        var covModel = new CoverageDataModel( { 
            goals : new SuiteInterpreter( this.name ) 
        } );
        this.name.on( "change", function() {
            self.filter = filterFactory.create( self.name.get("suiteName" ) );
        } );

        var lintFinder = new LintFinder();
        this.jasmine = jasModel;
        this.coverage = covModel;
        this.lint = lintModel;
        this.goalFailureCount = function() {
            return this.coverage.goalFailureCount( self.filter );
        };

        var testFinished;
        testFinished = function( ) {
            if ( jasModel.get("status") === "running" ) {
                postToParent( {messageType:"started"} );
            }
            if ( jasModel.get("status") === "done" ) {
                covModel.setData( $$_l );
                var found = lintFinder.find(); 
                if ( ! postToParent( { messageType:"lint", lintWork: found } ) ) {
                    lintModel.addFinderResult( found );
                }
                jasModel.off( 'change', testFinished );
                postToParent( {messageType:"finished"} );
            }
        };
      
        this.testFinished = testFinished;

        jasModel.on( 'change', testFinished );
        // check to see if already running or done.
        testFinished();

    };

    return Assembly;

} );

        
      


