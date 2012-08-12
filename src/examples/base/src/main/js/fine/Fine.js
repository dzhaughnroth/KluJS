/*global define:true */
define( ["../Base", "../lib/Common"], function(Base,Common) {
    var Fine = function() {
        this.fine = true;
        var base = new Base();
        this.isFine = function() {
            return this.fine && base.isBase();
        };
        this.common = Common;
    };

    return Fine;
} );