/*global define:false, window:false, document:false */
define( ["jquery", "./urlUtil"], function( $, urlParser ) {

    var ProxyLintRunner = function( noParent ) {
        var tryPosting = true;

        if ( noParent === true ) {
            tryPosting = false;
        }
        
        var jobs = {};
        
        var getPlainText = function( job, callback ) {
            var result = { id:job.id,
                           src:job.src };
            var loc = job.src + "?KluJSplain";
            $.ajax( loc, {dataType:"text",
                          async:true 
                         } )
                .done( function( text, status, ar) {
                    result.error = false;
                    result.text = text;
                    callback( result );
                } )
                .fail( function(text,status,ar) {
                    result.error = true;
                    result.message = "Http failed: " + loc;
                    callback( result );
                } );
        };
        
        var processingCallback = function( msg ) {
            var job = jobs[ msg.id];
            if ( job ) {
                if( msg.text ) {
                    try {
                        job.process( msg.text );
                    }
                    catch( e ) {
                        job.fail( "JSLint threw: " + e );
                    }
                }
                else {
                    job.fail( msg.message );
                }
            jobs[job.id] = undefined;
            }
    };
        
/*        var hasParent = function() {
            return window && window.parent && window.parent.postMessage 
                && window.parent !== window; 
        };
        
        var postToParent = function( src ) {
            if ( tryPosting && hasParent() ) {
                var msg = { messageType : "jslint",
                            message: { src:src,
                                       type:"foo"}};
                window.parent.postMessage( msg, window.location );
                return true;
            }
            else {
                return false;
            }       
        };
*/        
        this.runJob = function( job ) {
            
            jobs[job.id] = job;
            if ( job.src ) {
//                var mySrc = urlParser.absolute( window.location.toString(), job.src );
//                if ( postToParent( mySrc )) {
//                    return;
//                }           
                getPlainText( job, processingCallback );           
            }
        };
        
    };

    return ProxyLintRunner;
    
} );
