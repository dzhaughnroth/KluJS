/*globals define:false, klujsConfig:false */
define( [ "jquery" ],
        function( $ ) {
            var defaultFilter = function( src ) {
                return src && ! (src.match( /KluJS/ ) || src.match( /require\-jquery\.js$/ ));
            };

            var lf = this;
            // FIXME not a good default.
            // Move to klujsConfig.
            lf.filter = function( scriptEl ) {
                var src = scriptEl.attr( "src" );
                var result = defaultFilter( src );
                if ( typeof( klujsConfig ) !== "undefined" ) {
                    if ( typeof( klujsConfig.noDefaultFilter ) !== "undefined" ) {
                        if ( klujsConfig.noDefaultFilter ) {
                            result = true;
                        }
                    }
                    if ( typeof( klujsConfig.lintFilter ) === "function" ) {
                        result = result && klujsConfig.lintFilter( src, scriptEl );
                    }
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
                        ir.push( el.attr("src") );
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
