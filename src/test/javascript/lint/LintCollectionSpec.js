/*global define:false, describe:false, it:false, expect:false */
define( [ "lint/LintCollection", "lint/LintModel" ], function( LintCollection, LintModel ) {

    describe( "LintCollectionModel", function() {
        var lints = new LintCollection( );
        it( "Initializes to empty state", function() {
            expect( lints.length ).toBe( 0 );
        } );
        it( "Builds, adds LintModels, computes counts", function() {
            lints.add( new LintModel( { src : "foo" } ) );
            expect( lints.length ).toBe( 1 );

            var z = lints.at( 0 );
            expect( z.get("src") ).toBe( "foo" );
            expect( z.issueCount ).toBeDefined();
            lints.add( new LintModel( { src: "bar", done: "true" } ));
            expect( lints.length ).toBe( 2 );
            expect( lints.at(1).get("src") ).toBe( "bar" );
            lints.at( 1 ).issueCount = function() { return 10; };
            lints.add( new LintModel( { src: "baz", done: "true" } ) );
            lints.at( 2 ).issueCount = function() { return 5; };
            lints.add( new LintModel( { src: "wut", done: "true" } ) );
            lints.at( 3 ).issueCount = function() { return 0; };
            expect( lints.finished() ).toBe( 3 );
            expect( lints.issueCount() ).toBe( 16 ); // one for the unfinished
            expect( lints.failed() ).toBe( 3 );
            expect( lints.passed() ).toBe( 1 );
            lints.remove( lints.at( 0 ) );
            expect( lints.length ).toBe( 3 );
        } );
        it( "Supports adding a LintFinder result", function() {
            var mockFinderResult = {
                allModules : [ "found1", "found2" ],
                filterMap: { lib: [ "found4"] }
            };
            lints.addFinderResult( mockFinderResult );
            expect( lints.length ).toBe( 5 );
            expect( lints.finderResults ).toEqual( [ mockFinderResult ] );
            var mock2 = {
                allModules : [ "found1", "found3" ],
                filterMap: { lib: ["found5"] }
            };
            lints.addFinderResult( mock2 );
            expect( lints.length ).toBe( 6 );
            expect( lints.at(5).get( "src" ) ).toBe( "found3" );
            expect( lints.finderResults ).toEqual( [ mockFinderResult, mock2 ] );
            expect( lints.filterMap.lib ).toEqual( ["found4", "found5"] );
            // Note: we assume all filtering logic is identical,
            // so a filtered item in one child will not be unfiltered in another.
            // True enough at the moment.
        } );

    } );
} );
