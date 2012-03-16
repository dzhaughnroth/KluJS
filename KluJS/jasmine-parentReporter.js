/*global define:false, jasmine:false, window:false, console:false */

define( ["./lib/jasmine"], function( ) {
    var result = new jasmine.Reporter();
    var postToParent = function( msg ) {
        if ( window 
             && window.parent 
             && window.parent.postMessage 
             && window.parent !== window ) {
                 window.parent.postMessage( {messageType:msg}, window.location );
             }
        else {
            console.log( "No window.parent.postMessage method." );
        }
    };
    result.reportRunnerStarting = function( x ) {
        postToParent( "Started" );
    };
    result.reportRunnerResults = function( x ) {
        postToParent( "Finished" );
    };
    return result;
} );
