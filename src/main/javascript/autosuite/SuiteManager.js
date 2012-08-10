/*globals define:false */
define( [ "./SpecFinder", "./CodeFinder" ], function(SpecFinder, CodeFinder) {


    var create = function( mainDir, libDirs, testDir, fs ) {
        var finder = new SpecFinder( testDir, fs );
        var codeFinder = new CodeFinder( mainDir, fs );
        var get = function() {
            finder.find();
            var result = {};
            var specs = finder.suites;
            var targets = codeFinder.find().suites;
            var name, i;
            for ( name in targets ) {
                if ( targets.hasOwnProperty( name ) ) {
                    var path = mainDir + "/" + name;
                    var isLib = false;                    
                    for( i = 0; !isLib && i < libDirs.length; i++ ) {
                        if ( path.match( libDirs[i] ) ) {
                            isLib = true;
                        }
                    }
                    if ( !isLib ) {
                        result[name] = {
                            targets: codeFinder.suites[name]
                        };
                    }
                }
            }
            for ( name in specs ) {
                if ( specs.hasOwnProperty( name ) ) {
                    var item = result[name] || {};
                    item.specs = specs[name];
                    result[name] = item; // in case not there before.
                }
            }
            return result;
        };
        
        var getAsString = function() {
            return JSON.stringify( get(), 0, 4 );
        };
        
        return {
            get:get,
            getAsString:getAsString
        };
    };
    
    return { create:create };
} );