/*globals define:false */
define( [ "./SpecFinder" ], function(SpecFinder) {
    var create = function( testDir, fs ) {
        var finder = new SpecFinder( testDir, fs );
        
        var get = function() {
            finder.find();
            return finder.suites;
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