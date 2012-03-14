// This is an ordinary jasmine spec, not an async module definition.
// RequireJS would load it happily, but we are demonstrating
// that you can write a custom spec runner that loads its dependencies
// for it, independent of RequireJS.
describe( "Something", function() {
    it( "should add prefix and suffixes", function() {
        expect( foobar( "zot" ) ).toBe( "foo-zot-bar" );
    } );
});
