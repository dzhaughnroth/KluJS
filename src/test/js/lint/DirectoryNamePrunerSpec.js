/*globals define:false, describe:false, it:false, expect:false, JSLINT:false */

define( ["lint/DirectoryNamePruner"],

        function( pruner ) {
            describe( "DirectoryNamePruner", function() {
                it( "Prune dotdots", function() {
                    expect( pruner( "foo/../bar.js" )).toBe( "bar.js" );
                    expect( pruner( "foo/bar/../bar.js" )).toBe( "foo/bar.js" );
                    expect( pruner( "foo/bar/../../zot/../oof/bar.js" ))
                        .toBe( "oof/bar.js" );
                } );
                it( "Leaves other things alone", function() {
                    expect( pruner( "zot/./bar.js" )).toBe( "zot/./bar.js" );
                    expect( pruner( "../foo/bar.js" )).toBe( "../foo/bar.js" );
                    expect( pruner( "/../goo.js" )).toBe( "/../goo.js" );
                    expect( pruner( "//../goo.js" )).toBe( "//../goo.js" );
                } );
            });
});
