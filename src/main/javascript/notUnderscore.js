/*globals define:false, _:false, console:false */
define( ["./lib/klujsUnderscore"], function( ) {

    var result = _.noConflict();
    var slice = Array.prototype.slice;

    // This addresses a phantomjs issue. Somehow objects
    // get read only properties with indexes -1, -3, -6,
    // and undefined or null values. So we don't copy them.

    result.extend = function( obj ) {
        result.each(slice.call(arguments, 1), function(source) {
            var prop;
            for( prop in source) {
                if ( source.hasOwnProperty(prop) ) {
                    try {
                        obj[prop] = source[prop];
                    }
                    catch( x ) { 
                        if ( prop.indexOf( "-" ) !== 0 
                             || (source[prop]) ) {
                            console.log( "That error, but " + prop + " and " + obj[prop] + " " + typeof(obj[prop]));
                            throw x;
                        }
                        // else ignore the supposed problem
                    }
                }
            }
        } );
        return obj;
    };

    return result;

} );