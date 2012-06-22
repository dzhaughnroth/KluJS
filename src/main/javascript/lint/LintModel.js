/*global define:false, jasmine:false, JSLINT:false */
define( ["backbone", "underscore", "jquery"], function( Backbone, _, $ ) {
    var jslintImpl = JSLINT;
    var ajaxStrategy = function( src, onSuccess, onError ) {
        var loc = src + "?KluJSplain";
        $.ajax( loc, { dataType:"text", async:true } )
            .done( function( text, status, ar) {
                onSuccess( text );
            } )
            .fail( onError );
    };
    var issueCount = function() {
        var data = this.get("lintData");
        if ( ! data ) {
            throw( "No JSLINT data" );
//            return 1;
        }
        var errCount = 0;
        if( data.errors ) {
            errCount = data.errors.length;
        }
        if ( data.implieds ) {// && data.implieds.length ) {
            ++errCount;
        }
        if ( data.unused ) { //&& data.unused.length ) {
           ++errCount;
        }
        return errCount;
    };

    var LintModel = Backbone.Model.extend( {
        defaults : { 
            src : "Required at construction",
            done : false,
            error : false,
            loader : ajaxStrategy
//            message : "",
//            lintData : {}           
        },
        initialize : function() {
            _.bindAll( this, "process", "processError" );
        },
        issueCount : issueCount,
        check : function() {
            this.set( { done:false, error:false, message:"", lintData:{} } );
            this.get("loader")( this.get( "src" ), 
                                this.process,
                                this.processError );
        },
        processError: function( text, status ) {
            this.set( { done:true,
                        error:true,
                        message: "HTTP failed: " + status } );
        },
        process : function( jsText ) {
            var error = false;
            var message = "ok";
            var data;
            var impl = jslintImpl;
            try {
                impl( jsText, {} );
                try {                    
                    data = impl.data();
                }
                catch( x ) {
                    throw( "No data: " + x );
                }
            }
            catch( e ) {
                error = true;
                message = "JSLint failed: " + e;
            }
            var result = {
                message: message,
                error: error,
                lintData: data,
                done : true 
            };
            this.set( result );
        }

    } );

    return LintModel;

} );
