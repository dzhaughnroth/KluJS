/*global define:false, describe:false, it:false, expect:false, beforeEach:false, runs:false, waitsFor:false, klujs:false */
define( [ "autosuite/FsTraverser", "./MockFs.js", "jquery" ], function( FsTraverser, MockFs, $ ) {

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

    describe( "FsTraverser", function() {
        var finds = [];
        var topic = new FsTraverser( "root", new MockFs( anFs ));
        topic.foundFile = function( name, rel, total, stat ) {
            finds.push( arguments );
        };
        topic.foundDirectory = function( name, rel, total, stat ) {
            finds.push( arguments );
        };
        topic.find();
        it( "Finds Specs from fs", function() {
            var names = [ 'plainFile.js', 'aSpec.js', 'anotherSpec.js', 'aDir', 'subdirFile.js', 'subsub', 'gooSpec.js' ];
            expect( finds.map( function(x) { return x[0]; } ) ).toEqual( names );
            var relDiffs = [ "","","","","aDir/","aDir/", "aDir/subsub/" ];
            var i = 0;
            var rels = names.map( function( a ) { return relDiffs[i++] + a; } );
            expect( finds.map( function(x) { return x[1]; } ) ).toEqual( rels );
            var tots = rels.map( function( a ) { return "root/" + a; } );
            expect( finds.map( function(x) { return x[2]; } ) ).toEqual( tots );                
        } );

    } );
} );
