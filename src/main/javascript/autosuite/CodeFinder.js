/*global define:false */
define( [ "./FsTraverser"], function(FsTraverser) {

    var CodeFinder = function( basedir, fs ) {
        var suites; // a hashset with keys that are the relative paths.
        var traverser = new FsTraverser( basedir, fs );
        var regex = /\.js$/;
        traverser.foundDirectory = function() {

        };

        traverser.foundFile = function( fileName ) {
            if ( regex.test( fileName ) ) {
                var testPath = traverser.currentRelativePath + "/" + fileName;
                var suiteName = traverser.currentRelativePath;
                if ( suiteName === "" ) {
                    suiteName = "(base)";
                    testPath = fileName;
                }
                var suite = suites[suiteName]; 
                if ( typeof suite === "undefined" ) {
                    suite = [];
                    suites[suiteName] = suite;
                }
                suite.push( testPath );
            }
        };
        
        this.fs = fs;
        this.basedir = basedir;
        
        this.find = function() {
            suites = {};
            this.suites = suites;
            traverser.find();
            return this;
        };
    };

    return CodeFinder;
});
