/*global define:true */
define( [], function() {

    var Uncovered = function() {

        var echoic = function(a) {
            var result = a || "default";
            return result;
        };

        var branch = function( tf ) {
            if( tf ) {
                return true;
            }
            else {
                return false;
            }
        };

        var trinary = function( tf ) {
            return tf ? "yes" : "no";
        };

        this.echoic = echoic;
        this.branch = branch;
        this.trinary = trinary;
    };
    return Uncovered;

} );