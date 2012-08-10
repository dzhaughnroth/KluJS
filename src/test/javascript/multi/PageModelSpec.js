/*global define:false, describe:false, it:false, expect:false, runs:false, waitsFor:false */
define( [ "multi/PageModel","notJQuery", "ConfigFacade" ], function( PageModel, $, ConfigFacade ) {

    describe( "PageModel", function() {
        var config = new ConfigFacade( {
            suites : {
                Foo: ["foospec", "foofoospec"],
                Bar: ["barspec"]
            }
        } );
        var div = $("<div />");
        var topic = new PageModel( { 
            config: config,
            frameDiv: div
        } );
        it( "Should create suite runner frames, other models", function() {
            expect( topic.childFrames.length ).toBe( 2 );
            expect( div.children( "iframe" ).length ).toBe( 2 );
            expect( topic.lintModel.length ).toBe( 0 );  
            topic.lintFound( {
                allModules: ["foo", "bar"]
            } );
            expect( topic.lintModel.length ).toBe( 0 );  // computed later            
            expect( topic.lintQueue.length ).toBe( 1 );  // computed later            
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
            topic.coverageDataModel.on( 'change', function( ){
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
            runs( function() {
                expect( topic.coverageData().length ).toBe(2);
                expect( topic.coverageData()[0].runLines.foo ).toEqual( {"a":1, "b":2} );
                expect( resets.length ).toBe( 0 );
                expect( topic.get( "testDone" )).toBeUndefined();
                
                topic.check();
                expect( topic.get( "testDone" )).toBe( true );
                expect( resets.length ).toBe( 1 );
                expect( topic.get( "lintDone" )).toBeUndefined();                
            } );
            waitsFor( function() { return topic.get( "lintDone" ); }, 500 );
            runs( function() {
                var fooCoverage = topic.coverageDataModel.byFile.foo;
                expect( fooCoverage.line.missed ).toBe( 1 );
                expect( resets.length ).toBe( 1 );
                // Not so comp
                topic.set("testDone", false );
                expect( resets.length ).toBe( 1 );
            } );
        } );
        it( "Should compute lintFinder result on completion", function() {
            expect( topic.lintModel.length ).toBe( 2 );
        } );

        it( "Should accept delayed configuration", function() {
            var fd = $("<div />" );
            var pm = new PageModel( { frameDiv:fd } );
            expect( pm.childFrames.length ).toBe( 0 );
            pm.set("config", config );
            expect( fd.children().length ).toBe( 2 );
            pm.set("config", {} );
            expect( fd.children().length ).toBe( 2 );
            pm.set("config", config );
            expect( fd.children().length ).toBe( 2 );
        } );
        it( "Should have deadCode and codeList Models, and execute them", function() {
            runs( function() {
                expect( topic.codeListModel ).toBeDefined();
                expect( topic.deadCodeModel ).toBeDefined();
            } );
            waitsFor( function() { return topic.deadCodeModel.get("deadCode"); }, 500 );
            runs( function() {
                expect( topic.codeListModel.get("codeList" ) ).toBeDefined();
                expect( topic.deadCodeModel.get("deadCode" ) ).toBeDefined();
            } );
        } );

    } );


} );
