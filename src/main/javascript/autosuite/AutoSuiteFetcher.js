/*globals define:false */
define( [ "jquery" ], function( $ ) {

    var Fetcher = function( config, mockSrc ) {
        var src = mockSrc || "klujs-autoSuites.json";
        var fetch = function( callback, errorCallback ) {
            if ( ! config.autoSuites() ) {
                callback();
                return;
            }
            $.ajax( src, { async:true, dataType:"json" } )
                .done( function( data ) {
                    config.setSuites( data );
                    callback();
                } )
                .error( errorCallback );
        };

        this.fetch = fetch;
        this.src = src;
        this.config = config;
    };
    
    return Fetcher;    
} );
