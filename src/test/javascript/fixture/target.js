/*global define:false, uncovered:true */
define( function(qq) {
    
    var x = qq || {} || "never";

    var log = function( msg ) {
//        console.log( msg );
        return x;
    };

    var covered = function() {
        log( "This is covered" );
    };

    covered();

    uncovered = function( foo ) {
        log( "This is not covered." );
        if ( foo ) {
            log( "what" );
        }
    };

    var halfCovered = function( bool ) {
        return bool ? log( "half-true" ) : log( "half-false" );
    };

    halfCovered( );

    var twothirdsOneLineCovered = function( b1, b2 ) {
        var x = b1 ? ( b2 ? log( "2/3 1 tt" ) : log( "2/3 1 tf" ) ) : log( "2/3fx" );
        var y = (!b1) ? ( b2 ? log( "2/3 1 tt" ) : log( "2/3 1 tf" ) ) : log( "2/3fx" );
        return x + y;
    };

    twothirdsOneLineCovered( "1", "2" );
    twothirdsOneLineCovered( false, "2" );

    var multipleConditions = function( m1, m2 ) {
        var msg = m1 || m2 || "default";
        log( "multiple condition: " + msg );
    };

    multipleConditions();
    multipleConditions( "1" );

    var ands = function( x, y, z ) {
        if ( x && y && z) {
            log( "all three" );
        }
        else if ( x && y ) {
            log( "first two." );
        }
    };

    ands( "1" );
    ands( "1", "2" );
    
    // Trinary operator on separate line causes problem with node-coverage
    var trinary = function( x, y ) {
        this.xzxz = x ? x : 2; // oddly does not get a line number
        var xzxz = x ? x : 2;
        var q = "answer " 
                + (x ? 1 : 
                   ( y ? 1 : 3 )
                  );
        return q + xzxz;
    };

    trinary(0);
    trinary(1);

} );
