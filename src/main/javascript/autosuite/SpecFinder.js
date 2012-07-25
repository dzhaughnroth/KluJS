/*global define:false */
define( ["require"], function(require) {

    var SpecFinder = function( basedir, fs ) {
        this.fs = fs;
        this.basedir = basedir;
        this.suites = {};
        var self = this;
        var dirs = [];
        
        var totalPath = function( relPath ) {
            var result = basedir;
            if ( relPath !== "" ) {
                result = basedir + "/" + relPath;
            }
            return result;
        };
        
        var pathForFile = function( path, file ) {
            if ( path === "" ) {
                return file;
            }
            else {
                return path + "/" + file;
            }
        };
        
        var findDirs;
        var SfSelf = this;
        findDirs = function( path ) {
            var files = SfSelf.fs.readdirSync( totalPath( path ) );
            var i;
            for ( i = 0; i < files.length; i++ ) {
                var aPath = pathForFile( path, files[i] );
                if ( SfSelf.fs.statSync( totalPath(aPath) ).isDirectory() ) {  
                    dirs.push( aPath );
                    findDirs( aPath );
                }
            }
        };
        
        var findSpecsInDir = function( path ) {
            var result = [];
            var files = SfSelf.fs.readdirSync( totalPath(path) );
            var i;
            for( i = 0; i < files.length; i++ ) {
                if ( files[i].match( /.*Spec\.js$/ ) ) {
                    result.push( pathForFile( path, files[i] ) );
                }
            }
            return result;
        };
        
        var findSpecs = function() {
            var i;
            for( i = 0; i < dirs.length; i++ ) {
                var specsInDir = findSpecsInDir( dirs[i] );
                if ( specsInDir.length > 0 ) {
                    self.suites[dirs[i]] = specsInDir;            
                }
            }
            var baseSpecs = findSpecsInDir( "" );
            self.suites["(base)"] = baseSpecs;
        };
        
        /** 
         * This will return a map of directory 
         * names to lists of spec files 
         */
        this.find = function() {
            findDirs( "" );
            findSpecs();
            return this;
        };
    };

    return SpecFinder;
});
