/*global define:false, jasmine:false, JSLINT:false */
define( ["jquery" ], function( $ ) {

    //Singleton strategy pattern. blech.
    // TODO LintCollection get factory to make LintModel, 
    // factory supplies loader strategy to LintModel
    // strategy is attribute of factory.

    var parentWindowStrategy = function( src, onSuccess, onError ) {
        //        alert( "Not implemented, but send a message to parent window to check " + src );
    };
    var ajaxStrategy = function( src, onSuccess, onError ) {
        var loc = src + "?KluJSplain";
        $.ajax( loc, { dataType:"text", async:true } )
            .done( function( text, status, ar) {
                onSuccess( text );
            } )
            .fail( onError );
    };

    return {
        none : function() { },
        ajax : ajaxStrategy,
        parent : parentWindowStrategy
    };

} );


