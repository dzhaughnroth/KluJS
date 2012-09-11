/*global define:false, jasmine:false */
define( [ "../notJQuery", "../notUnderscore", "../notBackbone", "./SpecToText" ], function( $, _, Backbone, SpecToText ) {

    var Model = Backbone.Model.extend( {
        // spec
        // done
        // status
        briefDescription : function() {
            return SpecToText.brief( this.get("spec") );
        },
        fullDescription : function() {
            return SpecToText.full( this.get("spec") );
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
                        if ( r.skipped ) {
                            result = "skipped";
                        }
                        else {
                            if ( r.failedCount > 0 ) {
                                result = "failed";
                            }
                            else {
                                result = "passed";
                            }
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
