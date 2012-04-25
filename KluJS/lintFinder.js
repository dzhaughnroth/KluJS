/*globals define:false, klujs:false */
define( [ "jquery", "./dotdotPruner" ],
        function( $, pruner ) {
            var defaultFilter = function( src ) {
                if ( typeof( klujs.noDefaultFilter ) !== "undefined" ) {
                    if ( klujs.noDefaultFilter === true ) {
                        return true;
                    }
                }
                if ( ! src ) { return false; }
                if ( src === "boot.js" ) { return false; }
                if ( src.match( /KluJS/ ) ) { return false; }
                if ( src.match( /require\-jquery\.js$/ ) ) { return false; }
                return true;
            };

            var libFilter = function( src ) {
                var result = true;
                $.each( klujs.libDirs, function( i, x ) {
                    if ( src.match( x ) ) {
                        result = false;
                    }
                } );
                return result;
            };

            var lf = this;

            // TODO return value is enumeration "default" "lib" "custom"
            // return with result.
            lf.filter = function( scriptEl ) {
                var src = scriptEl.attr( "src" );
                src = pruner( src );
                var result = defaultFilter( src );
                result = result && libFilter( src );
                if ( typeof( klujs.lintFilter ) === "function" ) {
                    result = result && klujs.lintFilter( src, scriptEl );
                }
                return result;
            };

            lf.scriptTags = function() {
                var result = [];
                $("script").each( function( i, el ) {
                    result.push( $(this) );
                } );
                return result;
            };

            lf.find = function() {
                var found = lf.findJQueryScriptEls();
                var result = {};
                $.each( found, function( i, elArray ) {
                    var ir = [];
                    $.each( elArray, function( j, el ) {
                        ir.push( pruner(el.attr("src")) );
                    } );
                    result[i] = ir;
                });
                return result;
            };

            lf.findJQueryScriptEls = function() {
                var filtered = [],
                    allModules = [],
                    mainModules = [],
                    otherModules = [],
                    nonModules = [];
                var iEl, iAttrVal;
                $.each( lf.scriptTags(), function( i, scriptEl ) {
                    iEl = $(this);
                    iAttrVal = iEl.attr( "data-requiremodule" );
                    if ( lf.filter && 
                         lf.filter(iEl) ) {
                        if ( iAttrVal ) {
                            if ( iAttrVal.match( /\.js$/ ) ) {
                                otherModules.push( iEl );
                            }
                            else {
                                mainModules.push( iEl );
                            }
                        }
                        else {
                            nonModules.push( iEl );
                        }
                    }
                    else {
                        filtered.push( iEl );
                    }

                } );
                allModules = [].concat( mainModules, otherModules, nonModules );
                return { allModules: allModules,
                         mainModules:mainModules,
                         otherModules:otherModules,
                         nonModules:nonModules,
                         filtered:filtered };
            };
            return lf;
            
        } );
