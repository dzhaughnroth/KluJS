/*global define:false */
define( [], function() {

    var FsTraverser = function( baseDir, fs ) {
        var FsSelf = this;
        this.fs = fs;
        this.baseDir = baseDir;
        this.currentRelativePath = "";
        this.foundFile = function( fileName ) {
        };
        this.foundDirectory = function( fileName ) {
        };
        
        var concatPaths = function() {
            
            var result;
            var i = arguments.length;
            while ( !result && i >= 0) {
                --i;
                result = arguments[ i ];
            }
            --i;
            for( ; i >= 0; i-- ) {
                if ( arguments[i].length > 0 ) {
                    result = arguments[i] + "/" + result;
                }
            }
            return result;
        };
        
        // Current path relative to base directory; fileName optional
        var relativePath = function( fileName ) {
            return concatPaths( FsSelf.currentRelativePath, fileName );
        };

        var totalPath = function( fileName ) {
            return concatPaths( FsSelf.baseDir, relativePath( fileName ) );
        };
        var listFiles = function() {
            return FsSelf.fs.readdirSync( totalPath() );
        };
        var stat = function( fileName ) {
            return FsSelf.fs.statSync( totalPath( fileName ) );
        };

        var find;
        find = function( ) {
            var files = listFiles();
            var i;
            var dirs = [];
            for ( i = 0; i < files.length; i++ ) {
                var astat = stat(files[i]);
                if ( astat.isDirectory( files[i] ) ) {
                    dirs.push( files[i] );
                }
                else {
                    FsSelf.foundFile( files[i], relativePath( files[i] ), totalPath( files[i] ), stat );
                }
            }
            for ( i = 0; i < dirs.length; i++ ) {
                FsSelf.foundDirectory( dirs[i], relativePath( dirs[i] ), totalPath( dirs[i] ) );
                var current = FsSelf.currentRelativePath;
                FsSelf.currentRelativePath = concatPaths( FsSelf.currentRelativePath, dirs[i] );
                find( );
                FsSelf.currentRelativePath = current;
            }
        };
        
        this.find = function() {
            find( baseDir );
        };
    };

    return FsTraverser;
});
