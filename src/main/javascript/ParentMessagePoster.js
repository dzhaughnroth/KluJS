/*globals define:false, window:false */
define( [ ], function( ) {

    // Something that postMessage to parent window if possible and different.

    var Poster = function( mockWindow ) {
        var win = mockWindow || window;
        this.window = win;
        this.postToParent = function( msg ) {
            if ( win.parent && win.parent.postMessage && win.parent.window !== win ) {
                win.parent.postMessage( msg, win.location );
                return true;
            }
            else {
                return false;
            }
        };
    };

    return Poster;

} );

        
      


