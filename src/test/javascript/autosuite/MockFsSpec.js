/*global define:false, describe:false, it:false, expect:false */
define( [ "./MockFs.js", "jquery" ], function( MockFs, $ ) {

    var anFs = { 
        "plainFile.js":"File contents",
        "aSpec.js":"Another file contenst",
        "anotherSpec.js": "",
        aDir: {
            "subdirFile.js":"Stuff",
            subsub: {
                "gooSpec.js":"goostuff"
            }
        }
    };

    describe( "MockFs", function( ) {
        var topic = new MockFs( anFs );
        it( "Translates paths to objects in hierarchy", function() {
            expect( topic.objectForPath("") ).toBe( anFs );
            expect( topic.objectForPath( "aSpec.js" ) )
                .toBe( anFs["aSpec.js"]);
            expect( topic.objectForPath( "aSpec.js" ) )
                .toBeDefined( anFs["aSpec.js"]);
            expect( typeof topic.objectForPath( "aDir/subsub" ) )
                .toBe( "object" );
            expect( topic.objectForPath( "aDir/subsub/aSpec.js" ) )
                .toBeUndefined();
            expect( topic.objectForPath( "aDir/subsub" ) )
                .toEqual( { "gooSpec.js": "goostuff" } );
        } );
        it( "Mocks statSync.isDirectory", function() {
            expect( topic.statSync( "" ).isDirectory() ).toBe( true );
            expect( topic.statSync( "aDir/aSpec.js" ).isDirectory() ).toBe( false );
            expect( topic.statSync( "aDir/subsub" ).isDirectory() ).toBe( true );
            expect( topic.statSync( "aDir/subsub/gooSpec.js" ).isDirectory() ).toBe( false );
        } );
        it ( "Mocks readdirSync", function() {
            expect( topic.readdirSync("aDir") ).toEqual( ["subdirFile.js", "subsub" ] );
            expect( topic.readdirSync("") ).toEqual( [ 'plainFile.js', 'aSpec.js', 'anotherSpec.js', 'aDir' ] );
        } );
    } );

} );
