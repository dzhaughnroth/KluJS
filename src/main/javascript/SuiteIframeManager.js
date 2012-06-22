/*global jasmineGradle: true, $: false, define:false */
define( ["backbone", "jquery", "underscore"], function(Backbone, $, _) {
    var RUNNING = "running";
    var FAILED = "failed";
    var PASSED = "passed";
    var ChildIframeModel = Backbone.Model.extend( {
        defaults : {
            status : RUNNING,
            loaded : false
            // id, name, path supplied at construction
            // results at completion.
        },
        initialize : function() {
            _.bindAll( this, "check" );
            this.frame = $( "<iframe />" ).attr( "name", "frame" + this.get("id"))
                .attr( "id", "frame" + this.get("id") )
                .attr( "src", this.get("path") )
                .addClass( "childKlujsSuiteFrame" )
                .append( "No iframes support" );
            this.plainFrame = this.frame[0];
            this.plainFrame.onload = function() {
                this.set( "loaded", true );
            };
        },
        check : function() {
            var node = this.plainFrame.contentWindow;
            var self = this;
            if ( node && node.klujsAssembly 
                 && ( node.klujsAssembly.jasmine.get( "status" ) === "done" ) ) {
                var result = {
                    failedCount : 0,
                    passedCount : 0,
                    results : []
                };
                $.each( node.apiReporter.results(), function( i, r ) {
                    result.results.push( r );
                    if ( r.result === "failed" ) {
                        ++result.failedCount;
                    }
                    if ( r.result === "passed" ) {
                        ++result.passedCount;
                    }
                } );
                this.set("results", result );
                if ( result.failedCount > 0 ) {
                    this.set( "status", FAILED);
                }
                else {
                    this.set( "status", PASSED);
                }
            }
            else {
                this.setStatus( RUNNING );
            }
        }

    } );


    return ChildIframeModel;

} );


