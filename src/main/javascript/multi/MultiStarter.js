/*global define:false, window:false, klujs:false, console:false */
define( [ "jslint", "../lib/order!./PageModel", "../lib/order!./PageView", "jquery"], function( notlint, PageModel, PageView, $ ) {

    var frameDiv = $( "<div />" )
            .addClass("childIFrameContainer");
    $("body").append( frameDiv );
    var model = new PageModel( { frameDiv : frameDiv } );
    var view = new PageView( { model:model } ).render();

    var handlers = {
        finished: function( data ) { model.check();},
        started: function( data ) { },
        lint: function( data ) { model.lintFound( data.lintWork ); }
    };

    var eventHandler = function( msg ) {
        var handler = handlers[ msg.data.messageType ];
        if( handler ) {
            handler( msg.data, msg );
        }
        else {
            console.log( ["No handler for message", msg ] );
        }
    };

    window.addEventListener( "message", eventHandler );

    klujsPage = model;

} );
