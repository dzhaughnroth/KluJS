/*global define:false, describe:false, it:false, expect:false, beforeEach:false, runs:false, waitsFor:false, klujs:false */
define( [ "autosuite/SpecFinder", "./MockFs.js", "notJQuery" ], function( SpecFinder, MockFs, $ ) {

   var anFs = { 
       root : {
           "plainFile.js":"File contents",
           "aSpec.js":"Another file contenst",
           "anotherSpec.js": "",
           aDir: {
               "subdirFile.js":"Stuff",
               subsub: {
                   "gooSpec.js":"goostuff"
               }
           }
       }
    };

    describe( "SpecFinder", function() {
        var topic = new SpecFinder( "root", new MockFs( anFs ));
        it( "Initially blank", function() {
            expect( topic.suites ).toBeUndefined();
        } );           
        it( "Finds Specs from fs", function() {
            topic.find();
            expect( topic.suites ).toEqual( {
                "(base)":["aSpec.js", "anotherSpec.js"],
                "aDir/subsub":["aDir/subsub/gooSpec.js"]
            } );
        } );

    } );
} );
