//This is the easiest way to convert a commonsJs module to AMD.
define( function( require, exports, module ) {
//CommonJS
(function() {
    var Lib = require( "./Lib" ); 
    var lib = new Lib();
    exports.GlobalValue = "GlobalValue" + lib.a;
})();
//End CommonJS
});