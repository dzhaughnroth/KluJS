/*global define:false, jasmine:false */
define( ["../notJQuery" ], function( $ ) {
    
    var GVA = function() {
        var globalsAndFiles = {};

        var addGlobal = function( name, file ) {
            var files = globalsAndFiles[name];
            if ( ! files ) {
                files = [];
                globalsAndFiles[name] = files;
            }
            var index = 0;
            var last;
            $.each( files, function( i, fn ) {
                if ( fn <= file ) {
                    ++index;
                    last = fn;
                }
            } );
            if ( file !== last ) {
                files.splice( index, 0, file );
            }
        };

        var addGlobals = function( names, file ) {
            $.each( names, function( i, name ) {
                addGlobal( name, file );
            } );
        };
        var addLintData = function( data, file ) {
            if ( data && data.globals ) {
                addGlobals( data.globals, file );
            }
        };
        this.globalsAndFiles = globalsAndFiles;
        this.addGlobal = addGlobal;
        this.addGlobals = addGlobals;
        this.addLintData = addLintData;
    };

    return GVA;
} );
