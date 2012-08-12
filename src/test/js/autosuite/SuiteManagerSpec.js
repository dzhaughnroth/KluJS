/*global define:false, describe:false, it:false, expect:false, beforeEach:false, runs:false, waitsFor:false, klujs:false */
define( [ "autosuite/SuiteManager", "./MockFs.js" ], function( SuiteManager, MockFs ) {


    var anFs = { 
       root : {
           main : {
               "goo.js":"A file",
               aDir : {
               },
               bDir : { 
                   "x.js" : "No specs"
               },               
               lib : {
                   "q.js" : "Alib",
                   sublib : {
                       "q.js" : "Alib"
                   }
               }
              
           },
           test : {
               "plainFile.js":"File contents",
               "aSpec.js":"Another file contenst",
               "anotherSpec.js": "",
               aDir: {
                   "subdirFile.js":"Stuff",
                   subsub: {
                       "gooSpec.js":"goostuff"
                   }
               },
               cDir : {
                   "lostSpec.js":"Target elsewhere"
               }
           }
       }
    };


    describe( "SuiteManager", function() {
        var topic = new SuiteManager.create( "root/main", ["lib"], "root/test", new MockFs( anFs ));
        it( "Finds suites", function() {
            var expected = { "(base)": { targets: ["goo.js"],
                                         specs: [ "aSpec.js", "anotherSpec.js" ]
                                       },
                             "bDir" : { targets: [ "bDir/x.js" ] },
                             "aDir/subsub": { specs: [ "aDir/subsub/gooSpec.js" ]
                                            },
                             "cDir" : { specs: [ "cDir/lostSpec.js" ]
                                      }

                           };
            expect( topic.get() ).toEqual( expected );
            expect( topic.getAsString() ).toEqual( JSON.stringify( expected, 0, 4 ));
        } );
    } );
} );
