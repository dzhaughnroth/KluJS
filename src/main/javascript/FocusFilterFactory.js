/*globals define:false */
define( [ "./Config" ], function( notKlujs ) {

    var FocusFilterFactory = function( mockKlujs ) {
        var config = mockKlujs || notKlujs;
        var log = function( x ) {
//            console.log( x );
        };
        var createFocusFilter = function( suiteName ) {
            var pattern = "^/" + config.main() + "/";
            if ( suiteName !== "(base)" ) {
                pattern += suiteName + "/";
            }
            pattern += "[^\/]*$";
            // todo handle subsuites by excluding extra slashes at end.
            // todo handle exception rules.
            var regex = new RegExp( pattern );
            return function(x) {
                log( "Testing " + x.src + " against " + pattern );
                return regex.test( x.src );
            };
            
        };
        this.config = config;
        this.create = createFocusFilter;
    };

    return FocusFilterFactory;

} );

        
      


