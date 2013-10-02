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
	getSpecDetails : function( ) {
	    var assembly = this.assemblyOk();
	    if( assembly ) {
		return assembly.runnerModel.getSpecDetails();
	    }
	    return null;
	},
	getFailedSpecDetails : function( ) {
	    var assembly = this.assemblyOk();
	    if( assembly ) {
		return assembly.runnerModel.getFailedSpecDetails();
	    }
	    return null;
	},
	assemblyOk : function() {
            var cWin = this.plainFrame.contentWindow;
            if ( cWin && cWin.klujsAssembly ) {
		return cWin.klujsAssembly;
	    }
	    return null;
	},
        check : function() {
            var assembly = this.assemblyOk();
            if ( assembly ) {
                if ( assembly.error ) {
                    this.set( "status", ERROR );
                    this.set( "error", assembly.error );
                }
                else if ( assembly.runnerModel.get("done") ) {
                    var jasRunner = assembly.runnerModel;//.get( "runner" );
                    var result = jasRunner.getCounts();//results();
                    this.set("results", result );
                    if ( result.failedCount > 0 ) {
                        this.set( "status", FAILED);
                    }
                    else {
                        this.set( "status", PASSED);
                    }
                    var goalFailures = assembly.goalFailureCount();
                    this.set( "coverageGoalFailures", goalFailures );
                    var deadCodeResult = assembly.deadCode.get("deadCode");
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


