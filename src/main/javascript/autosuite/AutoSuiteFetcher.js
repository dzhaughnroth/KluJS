/*globals define:false */
define( [ "../notJQuery" ], function( $ ) {

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

        this.specs = function( callbackData ) {
            var result = {};
            $.each( callbackData, function( i, x ) {
                result[i] = x.specs;
            } );
            return result;
        };

        this.targets = function( callbackData ) {
            var result = {};
            $.each( callbackData, function( i, x ) {
                result[i] = x.targets;
            } );
            return result;
        };

    };
    
    return Fetcher;    
} );
