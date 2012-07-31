/*global define:false */
define( [ "../lib/order!./PageModel", "../lib/order!./PageView", "../lib/order!../autosuite/AutoSuiteFetcher", "../Config", "jquery"], function( PageModel, PageView, AutoSuiteFetcher, notKlujs, $ ) {
    
    var MultiStarter = function( headEl, bodyEl, windowImpl ) {
       
        var self = this;
        this.frameDiv = $( "<div />" )
            .addClass("childIFrameContainer").
            appendTo( bodyEl );
        var model = new PageModel( { frameDiv : self.frameDiv } );
        var view = new PageView( { model:model } ).render();
        var fetcher = new AutoSuiteFetcher( notKlujs );        
        this.model = model;
        this.view = view;
        this.fetcher = fetcher;
        this.config = notKlujs;

        var handlers = {
            finished: function( data ) { self.model.check();},
            started: function( data ) { },
            lint: function( data ) { self.model.lintFound( data.lintWork ); }
        };
            
        var eventHandler = function( msg ) {
            var handler = handlers[ msg.data.messageType ];
            if( handler ) {
                handler( msg.data, msg );
            }
        };
        
        var autoSuiteErrorCallback = function(err) {
            // FIXME reflect in view.
            model.set("failed", true );
            model.set("failure", err );
        };
 
        var autoSuiteCallback = function() {
            model.set( "config", self.config );
        };

        this.start = function() {
            windowImpl.addEventListener( "message", eventHandler );
            self.fetcher.fetch( autoSuiteCallback, autoSuiteErrorCallback );
        };
    };

    return MultiStarter;
        
} );

