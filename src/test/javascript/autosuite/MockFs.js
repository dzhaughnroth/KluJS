/*global define:false */
define( [ "jquery" ], function(  $ ) {

    var MockFs = function( object ) {
        var objectForPath = function( path ) {
            var current = object;
            var pathArray = path.split( "/" );
            var last = pathArray.pop();
            $.each( pathArray, function(i,name) {
                current = current[name];
            } );
            if ( last.length > 0 ) {
                return current[last];
            }
            return current;
        };
        this.objectForPath = objectForPath;
        this.statSync = function( path ) {
            var o = objectForPath( path );
            return { isDirectory : function() {
                return typeof o === "object";
            }
                   };
        };
        this.readdirSync = function( path ) {
            var result = [];
            $.each( objectForPath(path), function( name, x ) {
                result.push( name );
            } );                
            return result;
        };
    };
    return MockFs;

} );
