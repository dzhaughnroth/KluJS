/*globals define:false, describe:false, it:false, expect:false, JSLINT:false */

define( [ "lint/LintFinder", "notUnderscore" ], function( LintFinder, _ ) {
    var lf = new LintFinder();
//    lf.noDefaultFilter = undefined;
    describe( "LintFinder", function() {
        describe( "Filters", function() {
            var filterTargets = [ "KluJS/goo.js", 
                                  "whereever/require-jquery.js",
                                  "boot.js", 
                                  "src/main/javascript/lib/Library.js",
                                  "src/test/javascript/lib/TestLibrary.js",
                                  "lintable.js",
                                  "customFilterTarget.js" ];
            var filtered = [];
            lf.customFilter = function(src, pseudo) {
                filtered.push( arguments );
                var result = src !== "customFilterTarget.js" && 
                        !src.match( /LintFinderSpec\.js$/ );
                return result;
            };
            it( "KluJS stuff with by default", function() {
                expect( _.map( filterTargets, lf.defaultFilter )).
                    toEqual( [ false, false, false,
                               true, true,
                               true, true ] );
            } );
            it( "libraries with libFilter", function() {
                expect( _.map( filterTargets, lf.libFilter )).
                    toEqual( [ true, true, true,
                               false, false,
                               true, true ] );
            } );
            it( "Uses directory name pruner", function() {
                expect( lf.libFilter( 
                    "foo/../src/main/javascript/what/../lib/Library.js" ) )
                    .toBe( true );
            } );            
            it( "Returns name of filtered used", function() {
                expect( _.map( filterTargets, lf.filterSrc )).toEqual(
                    [ "default", "default", "default",
                      "lib", "lib", 
                      undefined, "custom" ] );
                expect( lf.filterSrc( undefined )).toBe( "default" );
            } );
            it( "Works even without custom filter", function() {
                var tmp = lf.customFilter;
                lf.customFilter = undefined;
                expect( _.map( filterTargets, lf.filterSrc )).toEqual(
                    [ "default", "default", "default",
                      "lib", "lib", 
                      undefined, undefined ] );
                lf.customFilter = tmp;
            } );
            it( "Can suspend default filter", function() {
                lf.noDefaultFilter = true;
                expect( lf.filterSrc( "boot.js" ) ).toBeUndefined(); 
                lf.noDefaultFilter = false;
                expect( lf.filterSrc( "boot.js" ) ).toBe( "default" );
            } );
            it ( "Applies custom filter", function() {
                filtered = [];
                var mock = {};
                expect( lf.filterSrc( "goo", mock ) ).toBeUndefined();
                expect( lf.filterSrc( "customFilterTarget.js" )).toBe( "custom" );
                expect( filtered.length ).toBe( 2 );
                expect( filtered[0][1] ).toBe( mock );               
            } );
        } );

        it( "Finds script tags", function() {
            var tags = lf.scriptTags();
            expect( tags.length > 5 ).toBe( true );
        } );
        it( "Assembles results", function() {
            var x = lf.find();
            expect( x.filterMap.custom.length ).toBe( 1 );
            expect( x.filterMap["default"].length > 0 ).toBe( true );
            expect( x.filterMap.lib.length > 0 ).toBe( true ); 
            expect( x.nonModules.length ).toBe( 1 );
            expect( x.mainModules.length > 5 ).toBe( true );
            expect( x.otherModules.length > 5 ).toBe( true );
            expect( x.nonModules.length + x.otherModules.length + x.mainModules.length )
                .toBe( x.allModules.length );
        } );

    });
});
