define( [ "./SpecFinder" ], function(SpecFinder) {
    var create = function( testDir ) {
        var finder = new SpecFinder( testDir );
        
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