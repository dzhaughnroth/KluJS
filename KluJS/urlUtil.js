/*globals define:false, JSLINT:false*/
define( ["jquery", "./lib/purl" ], function($,purl) {

    // FIXME use require.toURL instead.
    this.findScriptTags = function(regex) {
        var result = [];
        $( "script" ).each( function( i, scriptEl ) {
            var el = $(this);
            var src = el.attr( "src" );
            if ( src ) {
                if ( src.match( regex ) ) {
                    result.push( el );
                }
            }
        } );
        return result;
    };
    
    this.findSrcsForScriptTags = function( regex ) {
        var result = [],
            tags = this.findScriptTags(regex);
        $.each( tags, function( i, el ) {
            result.push( el.attr("src") );
        } );
        return result;
    };
        

    var stripZeroLength = function( x ) {
        var result = [], 
            i;
        for ( i = 0; i < x.length; i++ ) {
            if ( x[i] !== "" ) {
                result.push( x[i] );
            }
        }
        return result;
    };

    this.absolute = function( base, relativePath ) {
        return this.halfAbsolute( base, relativePath ).join( "" );
    };

    this.halfAbsolute = function( base, relativePath ) {
        if ( relativePath.match( /^http/ ) ) {
            return [ "", relativePath];
        }
        var dotDotMode = true;
        var baseUrl = purl( base );
        var battrs = baseUrl.attr();
        var relativeSegments = relativePath.split( "/" );
        var resultSegments = [].concat( baseUrl.segment() );
        resultSegments.pop();

        $.each( relativeSegments, function( i, x ) {
            if ( dotDotMode ) {
                if ( x !== "" ) {
                    if ( x === ".." ) {
                        resultSegments.pop();
                    }
                    else {
                        dotDotMode = false;
                    }
                }
            }
            if ( !dotDotMode ) {
                if ( x !== "" ) {
                    resultSegments.push( x );
                }
            }
        } );

        return [battrs.protocol + "://" + battrs.host 
                + ( battrs.port ? ":" + battrs.port : "" ), 
                "/" + resultSegments.join( "/" )];
    };

    this.relative = function(a,b) {
        var aUrl = purl( a );
        var bUrl = purl( b );
        var aSeg = stripZeroLength( aUrl.segment() );
        aSeg.pop();
        var bSeg = stripZeroLength( bUrl.segment() );
//        if ( bSeg.length == 0 ) {
//            bSeg.push( b );
//        }
        var result = [];
        var i = 0;
        while ( aSeg[i] === bSeg[i] && i < aSeg.length && i < bSeg.length ) {
            ++i;
        }
        var j = i;
        while ( i < aSeg.length ) {
            result.push( ".." );
            ++i;
        }
        while( j < bSeg.length ) {
            result.push( bSeg[j] );
            ++j;
        }
        return result.join( "/" );

    };


    return this;
} );

