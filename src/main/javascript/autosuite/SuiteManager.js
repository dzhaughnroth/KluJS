var SpecFinder = require( './SpecFinder' );
var create = function( testDir ) {
    var finder = new SpecFinder.SpecFinder( testDir );

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

exports.create = create;

