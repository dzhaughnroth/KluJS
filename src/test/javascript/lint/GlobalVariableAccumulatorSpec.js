/*globals define:false, describe:false, it:false, expect:false, JSLINT:false */

define( ["lint/GlobalVariableAccumulator"], function(GlobalVariableAccumulator) {
    var expected = {
        "foo" : ["Foo.js"],
        "bar" : ["Bar.js", "Foo.js", "Zot.js"],
        "baz" : ["Bar.js"]
    };


    describe( "GlobalVariableAccumulator", function() {
        var topic = new GlobalVariableAccumulator();
        it( "Should be initially empty", function() {
            expect( topic.globalsAndFiles ).toEqual( {} );            
        } );
        it( "Should accept name/fileName pairs", function() {
            topic.addLintData( {globals: ["foo", "bar"]}, "Foo.js" );
            topic.addLintData();
            topic.addGlobals( ["bar", "baz"], "Bar.js" );            
            topic.addGlobals( ["bar"], "Zot.js" );
            expect( topic.globalsAndFiles ).toEqual( expected );
        } );
        it( "Should collapse repeated additions", function() {
            topic.addGlobal( "bar", "Bar.js" );
            topic.addGlobal( "bar", "Zot.js" );
            topic.addGlobal( "bar", "Foo.js" );
            expect( topic.globalsAndFiles ).toEqual( expected );
        } );
    } );
});
