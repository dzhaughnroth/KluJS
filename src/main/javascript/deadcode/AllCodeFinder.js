/*global define:false */
define( [ "../autosuite/FsTraverser"], function(FsTraverser) {

    var AllCodeFinder = function( basedir, fs ) {
        var self = this;
        var pattern = /\.js$/;
        var traverser= new FsTraverser( basedir, fs );
        this.found = [];
        traverser.foundFile = function( name, rel, total ) {
            if ( pattern.test( name ) ) {
                self.found.push( "/" + total );
            }
        };

        this.find = function() {
            traverser.find();
            return this;
        };
    };

    return AllCodeFinder;
});
