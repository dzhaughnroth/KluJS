
/*globals define:false */
define( [ ], function() {

    var LibFilter = function( config ) {

        this.test = function( path ) {
            var i;
            if ( config.libDirs ) {
                for ( i = 0; i < config.libDirs.length; i++ ) {
                    if ( path.match( config.libDirs[i] ) ) {
                        return false;
                    }        
                }
            }
            if ( ! config.noDefaultFilter ) {
                if ( path.match( /^\/KluJS\// ) ) {
                    return false;
                }
                if ( path.match( /require-jquery\.js$/ ) ) {
                    return false;
                }        
            }
            return true;    
        };
    };
    
    return LibFilter;
} );