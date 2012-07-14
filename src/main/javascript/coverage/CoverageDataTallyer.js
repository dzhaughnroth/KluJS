/*global define:false, jasmine:false*/
define( [ "../lib/notUnderscore" ], function( _ ) {

    var CoverageSummary = function( ) {
        this.add = function( x ) {
            this.count += x.count;
            this.missed += x.missed;
        };
        this.count = 0;
        this.missed = 0;
    };

    CoverageSummary.prototype.rate = function() {
        if ( this.count > 0 ) {
            return 1.0 - this.missed/this.count;
        }
        else {
            return 0.0;
        }
    };

    // TODO what about the unlines?
    var tally = function( coverageDataProjectModel, optionalFilter ) {
        var filter = optionalFilter || function(x) { return true; };
        var lines = new CoverageSummary();
        var elements = new CoverageSummary();
        var files = 0;
        coverageDataProjectModel.filter( filter ).forEach(
            function( srcModel ) {
                ++files;
                var data = srcModel.data();
                lines.add( data.line );
                elements.add( data.element );                
            } );
        return { 
            files : files,
            line: lines,
            element:elements
        };


    };

    return tally;

} );
