/*globals define:false, $$_l:false, window:false */
define( [ 
    "./JasmineModel",
    "./coverage/CoverageDataModel",
    "./lint/LintFinder",
    "./lint/LintCollection"
], function( JasmineModel, CoverageDataModel, LintFinder, LintCollection ) {

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
        var jasModel = new JasmineModel( { jasmineImpl:mockJasmine } );
        var lintModel = new LintCollection();
        lintModel.on( 'add', function( modelAdded ) {
            modelAdded.check();
        } );
        var covModel = new CoverageDataModel.ProjectModel();
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

        
      


