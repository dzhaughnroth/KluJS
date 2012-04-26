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

            lf.filterNames = [ "custom", "lib", "default" ];

            // TODO return value is enumeration "default" "lib" "custom"
            // return with result.
            lf.filter = function( scriptEl ) {
                var src = scriptEl.attr( "src" );
                src = pruner( src );
                if ( ! defaultFilter( src ) ) {
                    return "default";
                }
                if ( ! libFilter( src ) ) {
                    return "lib";
                }
                if ( typeof( klujs.lintFilter ) === "function" ) {
                    if ( !klujs.lintFilter( src, scriptEl ) ) {
                        return "custom";
                    }
                }
                return undefined;
            };

            lf.scriptTags = function() {
                var result = [];
                $("script").each( function( i, el ) {
                    result.push( $(this) );
                } );
                return result;
            };

            lf.find = function() {
                // project scriptEls to their sources
                var found = lf.findJQueryScriptEls();
                var result = {};
                $.each( found, function( i, elArray ) {
                    if ( typeof( elArray.push ) === "function" ) {
                        var ir = [];
                        $.each( elArray, function( j, el ) {
                            ir.push( pruner(el.attr("src")) );
                        } );
                        result[i] = ir;
                    }
                    else {
                        var iObj = {};
                        $.each( elArray, function( j, arr ) {
                            iObj[j] = [];
                            $.each( arr, function( k, el ) {
                                iObj[j].push( pruner(el.attr("src")) );
                            } );
                        } );
                        result[i] = iObj;
                    }
                });
                return result;
            };

            lf.findJQueryScriptEls = function() {
                var filtered = [],
                    filterMap = {},
                    allModules = [],
                    mainModules = [],
                    otherModules = [],
                    nonModules = [];
                var iEl, iAttrVal;
                $.each( lf.scriptTags(), function( i, scriptEl ) {
                    iEl = $(this);
                    iAttrVal = iEl.attr( "data-requiremodule" );
                    var filterVal;
                    if ( lf.filter ) {
                        filterVal = lf.filter( iEl );
                    }
                    if ( ! filterVal ) {
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
                        var x = filterMap[filterVal];
                        if ( typeof( x ) === "undefined" ) {
                            x = [];
                            filterMap[filterVal] = x;
                        }
                        x.push( iEl );
                    }

                } );
                allModules = [].concat( mainModules, otherModules, nonModules );
                return { allModules: allModules,
                         mainModules:mainModules,
                         otherModules:otherModules,
                         nonModules:nonModules,
                         filtered:filtered,
                         filterMap:filterMap };
            };
            return lf;
            
        } );
