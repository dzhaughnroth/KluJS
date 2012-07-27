/*global define:false, window:false, console:false */
define( [ "../lib/order!./PageModel", "../lib/order!./PageView", "../lib/order!../autosuite/AutoSuiteFetcher", "../Config", "jquery"], function( PageModel, PageView, AutoSuiteFetcher, notKlujs, $ ) {

    var frameDiv = $( "<div />" )
            .addClass("childIFrameContainer");
    $("body").append( frameDiv );
    var model = new PageModel( { frameDiv : frameDiv } );
    var view = new PageView( { model:model } ).render();

    var autoSuiteErrorCallback = function() {
        // FIXME
        console.log( "Something went wrong loading autoSuite" );
    };
    var autoSuiteCallback = function() {
        model.set( "config", notKlujs );
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
    };
    
    var fetcher = new AutoSuiteFetcher();
    fetcher.fetch( autoSuiteCallback, autoSuiteErrorCallback );

} );
