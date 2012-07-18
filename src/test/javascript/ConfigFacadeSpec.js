/*global define:false, describe:false, it:false, expect:false */
define( [ "ConfigFacade" ], function( ConfigFacade ) {

    describe( "ConfigFacade", function() {
        var fakeConfig = {
            main : "a",
            mainPath : "aa",
            test : "b",
            suites : {
                "foo": ["bar", "baz"],
                "bar": ["foo", "baz"]
            },
            lintFilter : function() {},
            noDefaultFilter : "zap",
            libDirs : [ "weezle" ],
            lineCoverage : {
                max : 12
            },
            elementCoverage : {
                min : 0.9
            }
        };
        it( "It sets values from configuration", function() {
            var config = new ConfigFacade( fakeConfig );
            expect( fakeConfig ).toBe( config.rawConfig );
            expect( config.main() ).toBe("a");
            expect( config.mainPath() ).toBe("aa");
            expect( config.test() ).toBe("b");
            expect( config.suiteNames() ).toEqual( [ "foo", "bar" ] );
            expect( config.specsForSuite("bar") ).toEqual( ["foo", "baz"] );
            expect( config.lintFilter() ).toBe( fakeConfig.lintFilter );
            expect( config.libDirs() ).toBe( fakeConfig.libDirs );
            expect( config.noDefaultFilter() ).toBe( fakeConfig.noDefaultFilter );

            expect( config.lineCoverage() ).toBe( fakeConfig.lineCoverage );
            expect( config.elementCoverage() ).toBe( fakeConfig.elementCoverage );            
        } );
    } );
} );
