/*global define:false, describe:false, it:false, expect:false, runs:false, waitsFor:false, waits:false */
define( [ "jasmine/SuiteModel", "notUnderscore", "./MockJasmine.js" ], function( SuiteModel, _, MockJasmine ) {
    
    var mockSuite = new MockJasmine().standardSuite();
    describe( "SuiteModel", function() {
        var model = new SuiteModel();
        it( "Initially empty", function() {
            expect( model.get("suite") ).toBeUndefined();
            expect( model.suiteModels ).toEqual( {} );
            expect( model.specModels ).toEqual( {} );
        } );
        it( "Computes a tree of suites/spec models", function() {
            model.set( "suite", mockSuite );
            var specId = mockSuite.mockSpecs[0].id;
            var subsuiteId = mockSuite.mockSuites[0].id;
            var specKeys = _.keys( model.specModels );
            var suiteKeys =  _.keys( model.suiteModels );

            // underscore stringifies keys, alas
            expect( specKeys ).toEqual( [ specId.toString() ] );
            expect( suiteKeys ).toEqual( [ subsuiteId.toString() ] );

            var spec =  model.specModels[ specId ].get( "spec" );        
            expect( spec.description )
                .toBe( mockSuite.mockSpecs[0].description );
            
            var subModel = model.suiteModels[ subsuiteId ];
            expect( subModel.get("suite")).toBe( mockSuite.mockSuites[0] );
            // poke down a little through the tree...
            expect( _.keys( subModel.specModels ) ).toEqual( ['2', '3'] );
            var subsuiteSpec = subModel.specModels[3];
            expect( subsuiteSpec.get( "spec" ).description ).toBe( "spec3" );
        } );
        it( "Rolls up id models", function() {
            var suiteMap = {}; 
            var specMap = {};
            model.rollupIdMaps( suiteMap, specMap );
            expect( suiteMap ).toEqual( {
                4 : model.suiteModels[4],
                5 : model
            } );            
            expect( specMap ).toEqual( {
                1 : model.specModels[1],
                2 : model.suiteModels[4].specModels[2],
                3 : model.suiteModels[4].specModels[3]
            } );
        } );
                
    } );
} );
