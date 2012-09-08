/*globals define:false, $$_l:false */
define( [ 
//    "../jasmine/JasmineModel",
    "../jasmine/RunnerModel",
    "../SuiteName",
    "../FocusFilterFactory",
    "../ParentMessagePoster",
    "../coverage/CoverageDataModel",
    "../goals/SuiteInterpreter",
    "../lint/LintFinder",
    "../lint/LintCollection",
    "../deadcode/CodeListModel",
    "../deadcode/DeadCodeModel"
], function( RunnerModel, SuiteName, FocusFilterFactory, ParentMessagePoster, CoverageDataModel, SuiteInterpreter, LintFinder, LintCollection, CodeListModel, DeadCodeModel ) {

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
//        var jasmineModel = new JasmineModel( { jasmineImpl: jasmineImpl } );
        var runnerModel = new RunnerModel();
        jasmineImpl.getEnv().addReporter( runnerModel.jasmineReporter );
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

        var codeListModel = new CodeListModel();
        var deadCodeModel = new DeadCodeModel( {
            codeListModel: codeListModel,
            coverageDataModel: covModel
        } );
        var lintFinder = new LintFinder();
//        this.jasmine = jasmineModel;
        this.runnerModel = runnerModel;
        this.coverage = covModel;
        this.lint = lintModel;
        this.codeList = codeListModel;
        this.deadCode = deadCodeModel;
        this.goalFailureCount = function() {
            return this.coverage.goalFailureCount( self.filter );
        };
        var testFinished;
        testFinished = function( ) {
            if ( runnerModel.get("status") === "running" ) {
                postToParent( {messageType:"started"} );
            }
            if ( runnerModel.get("done") ) {
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
                runnerModel.off( 'change', testFinished );
                postToParent( {messageType:"finished"} );
            }
        };
      
        this.testFinished = testFinished;

        runnerModel.on( 'change', testFinished );
        // check to see if already running or done.
        testFinished();

    };

    return Assembly;

} );

        
      


