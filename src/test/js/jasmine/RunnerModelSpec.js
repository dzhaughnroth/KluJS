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
        it( "Follows jasmine execution via Reporter API", function() {
	    mockJasmine.applyMockResults( mockRunner, 0, 1 );
	    var aSpecModel = model.specMap[ aSpec.id ];
	    expect( aSpecModel.get("done") ).toBeFalsy();
	    model.jasmineReporter.reportSpecResults( aSpec );
	    expect( aSpecModel.get("done") ).toBe( true );
	    expect( aSpecModel.get("spec").results().failedCount ).toBe( 1 );
	    expect( aSpecModel.getResults().failedCount ).toBe( 1 );
	    
	    var mockSuiteModel = model.suiteMap[ mockSuite.id ];
	    expect( mockSuiteModel.get("done") ).toBeFalsy();
	    model.jasmineReporter.reportSuiteResults( mockSuite );
	    expect( mockSuiteModel.get( "done" )).toBe( true );
	    
	    expect( model.get("done")).toBeFalsy();
	    
	    _.each( model.specMap, function( specModel, id ) {
		specModel.set( "done", true );
	    } );
	    
	    model.jasmineReporter.reportRunnerResults( mockRunner );
	    expect( model.get("done")).toBe( true );
	    
	    expect( model.get("status") ).toBe( "failed" );

	    var specDetails = model.getSpecDetails();
	    expect( specDetails[1].title ).toBe( "spec1" );
	    expect( specDetails[1].details[0].text ).toBe( "Fail message 0" );
	    expect( specDetails[2].details[0].text ).toBe( "Passed." );
	    console.log( [ "Spec details", model.getSpecDetails() ] );

	    var failDetails = model.getFailedSpecDetails();
	    console.log( [ "Fail details", model.getFailedSpecDetails() ] );
	    expect( failDetails[1]).toEqual( specDetails[1] );
	    expect( failDetails[2] ).toBeUndefined();
	    mockJasmine.applyMockResults( mockRunner, 0, 0 );	    
	    _.each( model.specMap, function( specModel, id ) {
		specModel.set( "done", false );
		specModel.set( "done", true );
	    } );

            model.set("done", false);
            model.set("done", true);
            expect( model.get("status") ).toBe( "passed" );            

            model.jasmineReporter.log( "foo" );
        } );
	it( "Provides details of spec results when done", function() {
	    var specDetails = model.getSpecDetails();
	    expect( specDetails[2].details[0].text ).toBe( "Passed." );


	} );
     } );
} );
