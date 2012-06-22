/*global define:false, describe:false, it:false, expect:false */
define( [ "multi/PageModel","jquery" ], function( PageModel, $ ) {

    describe( "PageModel", function() {
        var config = {
            suites: {
                Foo: ["foospec", "foofoospec"],
                Bar: ["barspec"]
            }
        };
        var div = $("<div />");
        var topic = new PageModel( { 
            config: config,
            frameDiv: div
        } );
        it( "Should create suite runner frames", function() {
            expect( topic.childFrames.length ).toBe( 2 );
            expect( div.children( "iframe" ).length ).toBe( 2 );
        } );
        it( "Should accept lintFinder results", function() {
            expect( topic.lintModel.length ).toBe( 0 );
            topic.lintFound( {
                allModules: ["foo", "bar"]
            } );
            expect( topic.lintModel.length ).toBe( 2 );
        } );
        it( "Should check them when asked", function() {
            var checkCount = 0;
            topic.childFrames.forEach( function( x ) {
                x.check = function() {
                    ++checkCount;
                };
            } );
            topic.check();
            expect( checkCount ).toBe( 2 );
        } );
        it( "Should compute aggreage coverage results from children when done", function() {
            var resets = [];
            topic.coverageDataModel.on( 'reset', function( ){
                resets.push( arguments );
            } );
            // caution: mocking
            topic.childFrames.each( function( x ) {
                x.set("status", "passed");
                x.plainFrame = {
                    contentWindow : {
                        $$_l : { 
                            lines : { 
                                foo: ["a", "b", "c"]
                            },
                            runLines: { 
                                foo: { "a":1, "b":2} 
                            },
                            allConditions: { foo : [] },
                            conditions: { foo: [] }                            
                        }
                    }
                };
            } );
            expect( topic.coverageData().length ).toBe(2);
            expect( topic.coverageData()[0].runLines.foo ).toEqual( {"a":1, "b":2} );
            expect( resets.length ).toBe( 0 );
            topic.check();
            expect( resets.length ).toBe( 1 );
            topic.coverageDataModel.forEach( function( x ) {
                var covData = x.get("calculator").nodeCoverage;
                expect( covData.runLines.foo ).toEqual( {"a":2, "b":4 } );
                expect( x.get("calculator").coverageByFile.foo.line.missed ).toBe( 1 );
            } );
        } );

    } );


} );