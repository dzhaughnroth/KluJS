/*global define:false */
define( [ "./FsTraverser"], function(FsTraverser) {

    var CodeFinder = function( basedir, fs ) {
        var suites; // a hashset with keys that are the relative paths.
        var traverser = new FsTraverser( basedir, fs );
        var regex = /\.js$/;
        traverser.foundDirectory = function() {

        };
        var filterRegex = [ /require\.js$/, /require-jquery\.js$/ ];
        var filter = function( path ) {
            var result = false;
            var i;
            for ( i = 0; i < filterRegex.length; i++ ) {
                result = result || filterRegex[i].test( path );
            }                
            return result;
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
                if ( ! filter( testPath ) ) {
                    suite.push( testPath );
                }
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
