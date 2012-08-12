/*global jasmineGradle: true, $: false, define:false, window:false */
define( ["../notBackbone", "../notJQuery", "../notUnderscore"], function(Backbone, $, _) {
    var RUNNING = "running";
    var FAILED = "failed";
    var PASSED = "passed";
    var ERROR = "error";

    var ChildFrameModel = Backbone.Model.extend( {
        defaults : {
            status : RUNNING,
            loaded : false
            // suite supplied at construction
            // results at completion.
        },
        pathFactory : function( suiteName ) {
            return window.location.href + "?suite=" + suiteName;
        },
        initialize : function() {
            var self = this;
            _.bindAll( this, "check" );
            this.path = this.pathFactory( this.get( "suite" ) );
            this.frame = $( "<iframe />" ).attr( "name", "frame" + this.cid )
                .attr( "id", "frame" + this.cid )
                .attr( "src", this.path )
                .addClass( "childKlujsSuiteFrame" )
                .addClass( "hidden" )
                .append( "No iframes support" );
            this.plainFrame = this.frame[0];
            this.plainFrame.onload = function() {
                self.set( "loaded", true );
            };
        },
        check : function() {
            var cWin = this.plainFrame.contentWindow;
            if ( cWin && cWin.klujsAssembly ) {
                if ( cWin.klujsAssembly.error ) {
                    this.set( "status", ERROR );
                    this.set( "error", cWin.klujsAssembly.error );
                }
                else if ( cWin.klujsAssembly.jasmine.get( "status" ) === "done" ) {
                    var result = {
                        count : 0,
                        failedCount : 0,
                        passedCount : 0
                    };
                    var jasResults = cWin.klujsAssembly.jasmine.get( "result" );
                    result.failedCount = jasResults.failed;
                    result.passedCount = jasResults.count - result.failedCount;
                         result.count = jasResults.count;
                    this.set("results", result );
                    if ( result.failedCount > 0 ) {
                        this.set( "status", FAILED);
                    }
                    else {
                        this.set( "status", PASSED);
                    }
                    var goalFailures = cWin.klujsAssembly.goalFailureCount();
                    this.set( "coverageGoalFailures", goalFailures );
                    var deadCodeResult = cWin.klujsAssembly.deadCode.get("deadCode");
                    this.set( "deadCodeResult", deadCodeResult );
                }
                else {
                    this.set( "status", RUNNING );
                }
            }
        }
        
            
    } );


    return ChildFrameModel;

} );

