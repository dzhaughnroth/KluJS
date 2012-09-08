/*global define:false, jasmine:false */
define( [ "../notJQuery", "../notUnderscore", "../notBackbone"], function( $, _, Backbone ) {

    var Model = Backbone.Model.extend( {
        // spec
        // done
        // status
        briefDescription : function() {
            var text = "";
            var spec = this.get("spec");
            if ( spec ) {
                text = spec.description;
            }
            return text;
        },
        fullDescription : function() {
            var text = "";
            var spec = this.get("spec");
            if ( spec ) {
                text = spec.description;
                var parent = spec.suite;
                while( parent ) {
                    text = parent.description + " " + text;
                    parent = parent.parentSuite;
                }
            }
            return text;
        },
        initialize : function() {
            _.bindAll( this, "updateStatus", "fullDescription", "briefDescription" );
            this.updateStatus();
            this.on( "change:spec", this.updateStatus );
            this.on( "change:done", this.updateStatus );
        },
        updateStatus : function() {
            var s = this.get("spec");
            var done = this.get("done");
            var result = "new";
            if ( s ) {
                if ( done ) {
                    var r = s.results();
                    if ( r ) {
                        if ( r.failedCount > 0 ) {
                            result = "failed";
                        }
                        else {
                            result = "passed";
                        }
                    }
                    else {
                        result = "error";
                    }
                }
                else {
                    result = "running";
                }
            }
            this.set("status", result);
        }
        
    } );

    return Model;
    
} );
