/*globals define:false, klujs:false */
define( [ ], function() {

    var FocusFilterFactory = function( mockKlujs ) {
        var config = mockKlujs || klujs;
        var log = function( x ) {
 //           console.log( x );
        };
        var createFocusFilter = function( suiteName ) {
            var pattern = "^" + config.main.substring(2) + "/";
            if ( suiteName !== "(base)" ) {
                pattern += suiteName + "/";
            }
            pattern += "[^\/]*$";
            // todo handle subsuites by excluding extra slashes at end.
            // todo handle exception rules.
            var regex = new RegExp( pattern );
            return function(x) {
                log( "Testing " + x.get("src") + " against " + pattern );
                return regex.test( x.get("src") );
            };
            
        };
        this.config = config;
        this.create = createFocusFilter;
    };

    return FocusFilterFactory;

} );

        
      


