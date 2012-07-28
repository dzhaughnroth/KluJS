/*global define:false, describe:false, it:false, expect:false, beforeEach:false, runs:false, waitsFor:false, klujs:false */
define( [ "deadcode/AllCodeFinder", "../autosuite/MockFs.js" ], function( SpecFinder, MockFs ) {

   var anFs = { 
       root : {
           "plainFile.js":"File contents",
           "anotherSpec.js": "",
           aDir: {
               "subdirFile.js":"Stuff",
               "some.txt":"Goo",
               subsub: {
                   "gooSpec.js":"goostuff"
               }
           }
       }
    };

    describe( "AllCodeFinder", function() {
        var topic = new SpecFinder( "root", new MockFs( anFs )).find();
        it( "Finds Specs from fs", function() {
            expect( topic.found ).toEqual( 
                ["/root/plainFile.js", "/root/anotherSpec.js", 
                 "/root/aDir/subdirFile.js", "/root/aDir/subsub/gooSpec.js"
                ] );
            var prevFound = topic.found;
            // test that it clears old values
            topic.find();
            expect( topic.found ).toEqual( prevFound );
        } );
    } );

} );
