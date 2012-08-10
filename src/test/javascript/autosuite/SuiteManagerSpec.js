/*global define:false, describe:false, it:false, expect:false, beforeEach:false, runs:false, waitsFor:false, klujs:false */
define( [ "autosuite/SuiteManager", "./MockFs.js", "notJQuery" ], function( SuiteManager, MockFs, $ ) {

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

    describe( "SuiteManager", function() {
        var topic = new SuiteManager.create( "root", new MockFs( anFs ));
        it( "Finds suites", function() {
            var expected = { "(base)": [ "aSpec.js", "anotherSpec.js" ],
                             "aDir/subsub": [ "aDir/subsub/gooSpec.js" ]  };
            expect( topic.get() ).toEqual( expected );
            expect( topic.getAsString() ).toEqual( JSON.stringify( expected, 0, 4 ));
        } );

    } );
} );
