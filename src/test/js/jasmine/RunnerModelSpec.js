/*global define:false, describe:false, it:false, expect:false, runs:false, waitsFor:false, waits:false */

define( [ "jasmine/RunnerModel", "notUnderscore", "./MockJasmine.js", "notJQuery" ], function( RunnerModel, _, MockJasmine, $ ) {

    var mockJasmine = new MockJasmine();
    var mockRunner = mockJasmine.standardRunner();
    var mockSuite = mockRunner.suites()[0];
    var aSpec = mockSuite.mockSpecs[0];
    describe( "RunnerModel", function() {
        var model = new RunnerModel();
        it( "Exists", function() {
            expect( model ).toBeDefined();
            expect( model.get("runner") ).toBeUndefined();
            expect( model.jasmineReporter ).toBeDefined();
            //                expect( 0 ).toBe( 1 );
            expect( model.suiteModels ).toEqual( {} );
            expect( model.suiteMap ).toEqual( {} );
            expect( model.specMap ).toEqual( {} );
        } );
        it( "Builds child models, with map", function() {
            model.jasmineReporter.reportRunnerStarting( mockRunner );
            expect( model.get("status")).toBe( "running" );
            expect( model.get( "runner" ) ).toBe( mockRunner );
            var suiteModel = model.suiteModels[ mockSuite.id ]; 
            var suite = suiteModel.get( "suite" );
            expect( suite.id ).toBe( mockSuite.id );
            expect( _.keys( model.suiteMap ) ).toEqual( ['4', '5'] );
            expect( _.keys( model.specMap ) ).toEqual( ['1', '2', '3'] );
            expect( model.specMap[aSpec.id].get("spec") ).toBe( aSpec );
        } );
        it( "Has reporter that links jasmine execution to models", function() {               
            mockJasmine.applyMockResults( mockRunner, 0, 1 );
            var aSpecModel = model.specMap[ aSpec.id ];
            expect( aSpecModel.get("done") ).toBeFalsy();
//            aSpec.mockResults = mockJasmine.makeMockResults( 5, 1 );
            model.jasmineReporter.reportSpecResults( aSpec );
            expect( aSpecModel.get("done") ).toBe( true );
            expect( aSpecModel.get("spec").results().failedCount ).toBe( 1 );

            var mockSuiteModel = model.suiteMap[ mockSuite.id ];
            expect( mockSuiteModel.get("done") ).toBeFalsy();
            model.jasmineReporter.reportSuiteResults( mockSuite );
            expect( mockSuiteModel.get( "done" )).toBe( true );
            
            expect( model.get("done")).toBeFalsy();
//            mockRunner.mockResults = mockJasmine.makeMockResults( 10, 2 );
            model.jasmineReporter.reportRunnerResults( mockRunner );
            expect( model.get("done")).toBe( true );
            expect( model.get("status") ).toBe( "failed" );            

            mockJasmine.applyMockResults( mockRunner, 0, 0 );
            model.set("done", false);
            model.set("done", true);
            expect( model.get("status") ).toBe( "passed" );            



            model.jasmineReporter.log( "foo" );
        } );
     } );
} );
