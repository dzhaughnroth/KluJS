/*global define:false, jasmine:false*/
define( ["../lib/notBackbone", "../lib/notUnderscore", "../notJQuery" ], function( Backbone, _, $ ) {

    var JasmineModel = Backbone.Model.extend( {
        defaults : { 
            status : "new",
            result : {}
        },
        initialize : function() { 
            // have to be slightly extra lazy that the Backbone default here.
            var jaz = this.get("jasmineImpl");
            var listener = new jaz.Reporter();
            var apiReporter = new jaz.JsApiReporter();
            jaz.getEnv().addReporter( apiReporter );
            jaz.getEnv().addReporter( listener );
            var self = this;
            listener.reportRunnerStarting = function () {
                self.set( "result", {} );
                self.set( "status", "running" );
            };
            listener.reportRunnerResults = function() {
                self.set( "status", "done" );
                self.set( "result", self.computeResult( apiReporter.results() ) );
            };
            this.listener = listener;
        },
        computeResult : function( jsApiResults ) { // allows mocking
            var failedCount = 0;
            var passedCount = 0;
            var count = 0;
            var results = [];
            _.each( jsApiResults, function( r ) {
                results.push( r );
                if ( r.result === "failed" ) {
                    ++failedCount;
                }
                if ( r.result === "passed" ) {
                    ++passedCount;
                }
                ++count;
            } );
            return {
                count : results.length,
                failed : failedCount,
                results : jsApiResults
            };       
        }

    } );

    return JasmineModel;


} );
