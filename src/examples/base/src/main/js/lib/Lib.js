// The lib dir is not linted or anything.
define( [], function() {
    var unused = 12;
    var uncalled = function() {
        return "Don't do that";
    };
    var Lib = function() {
        this.a = "a";
        this.b = "b";
    };
    return Lib;
} );
