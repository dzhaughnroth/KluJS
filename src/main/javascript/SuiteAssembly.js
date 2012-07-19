/*globals define:false, $$_l:false, window:false */
define( [ 
    "./JasmineModel",
    "./SuiteName",
    "./coverage/CoverageDataModel",
    "./goals/SuiteInterpreter",
    "./lint/LintFinder",
    "./lint/LintCollection",
    "./lib/notBackbone"
], function( JasmineModel, SuiteName, CoverageDataModel, SuiteInterpreter, LintFinder, LintCollection, Backbone ) {

    // optional args for testing; defaults to window, jasmine globals
    var Assembly = function( mockWindow, mockJasmine ) {
        var win = mockWindow || window;
        var postToParent = function( msg ) {
            if ( win.parent && win.parent.postMessage && win.parent.window !== win ) {
                win.parent.postMessage( msg, win.location );
                return true;
            }
            else {
                return false;
            }
        };
        this.name = new SuiteName.Model();
        var jasModel = new JasmineModel( { jasmineImpl:mockJasmine } );
        var lintModel = new LintCollection();
        lintModel.on( 'add', function( modelAdded ) {
            modelAdded.check();
        } );
        var covModel = new CoverageDataModel( { 
            goals : new SuiteInterpreter( this.name ) 
        } );
        var lintFinder = new LintFinder();

        var self = this;
        var listener = function() {
            self.testFinished();
        };
        var testFinished = function() {
            if ( jasModel.get("status") === "running" ) {
                postToParent( {messageType:"started"} );
            }
            if ( jasModel.get("status") === "done" ) {
                covModel.setData( $$_l );
                var found = lintFinder.find(); 
                if ( ! postToParent( { messageType:"lint", lintWork: found } ) ) {
                    lintModel.addFinderResult( found );
                }
                jasModel.off( 'change', listener );
                postToParent( {messageType:"finished"} );
            }
        };
        
        this.testFinished = testFinished;
        this.jasmine = jasModel;
        this.coverage = covModel;
        this.lint = lintModel;
        jasModel.on( 'change', listener );
        testFinished();

    };

    return Assembly;

} );

        
      


