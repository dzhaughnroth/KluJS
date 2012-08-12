/*global define:false, describe:false, it:false, expect:false, beforeEach:false, runs:false, waitsFor:false, klujs:false */
define( [ "autosuite/CodeFinder", "./MockFs.js", "notJQuery" ], function( CodeFinder, MockFs, $ ) {

   var anFs = { 
       root : {
           "require.js" : "ignored",
           "plainFile.js":"File contents",
           "aSpec.js":"Another file contenst",
           "anotherSpec.js": "",
           aDir: {
               "blah.json" : "json",
               subsub: {
                   "gooSpec.js":"goostuff"
               }
           },
           bDir : {
               "subdirFile.js":"Stuff"
           },
           cDir : {
               dDir: {
                   "kust.html":"h"
               }
           }
       }
    };

    describe( "CodeFinder", function() {
        var topic = new CodeFinder( "root", new MockFs( anFs ));
        it( "Initially blank", function() {
            expect( topic.suites ).toBeUndefined();
        } );           
        it( "Finds Specs from fs", function() {
            topic.find();
            expect( topic.suites ).toEqual( {
                "(base)": ["plainFile.js", "aSpec.js", "anotherSpec.js"],
                "aDir/subsub":["aDir/subsub/gooSpec.js"],
                "bDir":[ "bDir/subdirFile.js"]
            } );
        } );

    } );
} );
