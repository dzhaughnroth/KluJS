/*globals define:false */
define( [ ],
        function( ) {
            var regex = /[^\/]+\/\.\.\//; // Matches "stuff/../", not "/stuff/.." 
           
            var pruneDotDots = function( path ) {
                var prev;
                var result = path;
                do {
                    prev = result;
                    result = result.replace( regex, "" );
                }
                while( prev !== result );
                return result;
            };

            return pruneDotDots;
            
        } );
