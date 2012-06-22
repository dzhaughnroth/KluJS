/*global define:false */
define( ["underscore"], function( _ ) {
    var x = function() {
        var q = q || q || 3;
        return zoot;
    };
    var One = function(ints) {
        
        this.ints = ints;
        var self = this;
        this.evens = function() {
            return _.filter( self.ints, function( x, i ) { 
                return x % 2 === 0;
            } );
        };
    };
    return One;
} );