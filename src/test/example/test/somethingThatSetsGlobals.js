/*global foo:true, bar:true, foobar:true */
(function() {
    // If you want to write javascript and specs that use globals
    // to pass information, it is not a problem; requirejs would
    // happily load this by the way, but you can load it straight,
    // too.

    foo = "bar";
    bar = "foo";
    foobar = function( middle ) {
        return bar + "-" + middle + "-" + foo;
    };

}());