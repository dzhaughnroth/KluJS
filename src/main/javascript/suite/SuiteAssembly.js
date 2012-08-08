/*globals define:false, $$_l:false */
define( [ 
    "../jasmine/JasmineModel",
    "../SuiteName",
    "../FocusFilterFactory",
    "../ParentMessagePoster",
    "../coverage/CoverageDataModel",
    "../goals/SuiteInterpreter",
    "../lint/LintFinder",
    "../lint/LintCollection"
], function( JasmineModel, SuiteName, FocusFilterFactory, ParentMessagePoster, CoverageDataModel, SuiteInterpreter, LintFinder, LintCollection ) {

    var Assembly = function( windowImpl, jasmineImpl ) {
        var self = this;
        var parentPoster = new ParentMessagePoster( windowImpl );
        var postToParent = function( msg ) {
            return parentPoster.postToParent( msg );
        };
        var filterFactory = new FocusFilterFactory();
        this.filter = function() { return true; };
        this.error = null;
        this.fail = function( err ) {
            self.error = err;
            postToParent( { messageType:"finished" } );
        };
        this.name = new SuiteName.Model();
        var jasModel = new JasmineModel( { jasmineImpl: jasmineImpl } );
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
                if ( typeof $$_l !== "undefined" ) {
                    covModel.setData( $$_l );
                }
                else {
                    covModel.noData();
                }
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

        
      


