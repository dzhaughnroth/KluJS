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
	getResults : function() { 
	    // The object here is to keep client code
	    // from depending on details of Jasmine result API.
            var s = this.get("spec");
	    var results;
	    if ( s ) {
                var r = s.results();
		var detailItems = [];
		_.each( r.getItems(), function( item, index ) {
		    var detail = {
			index : index + 1,
			text : item.toString(),
			passed : item.passed()
		    };
		    if ( item.trace ) {
			detail.stackTrace = item.trace.stack;
		    }
		    detailItems.push( detail );
		} );
		results = {
		    skipped : r.skipped,
		    failedCount : r.failedCount,
		    details : detailItems
		};
		
	    }
	    return results;
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
