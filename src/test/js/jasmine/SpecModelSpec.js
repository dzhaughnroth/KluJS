/*global define:false, describe:false, it:false, expect:false, runs:false, waitsFor:false, waits:false */
define( [ "jasmine/SpecModel", "./MockJasmine.js" ], function( SpecModel, MockJasmine ) {

    var mockJasmine = new MockJasmine();
    var mockSpec = mockJasmine.makeMockSpec();

    describe( "SpecModel", function() {
        var model = new SpecModel();
        var status = function() { return model.get("status"); };
        it( "Computes status", function() {
            expect( status() ).toBe( "new" );
	    expect( model.getResults() ).toBeUndefined(); 
            model.set("spec", mockSpec );
            expect( status() ).toBe( "running" );

            model.set("done", true );
            expect( status() ).toBe( "error" );

	    mockSpec.mockResults = mockJasmine.makeMockResults( 3,2 );
            model.set("done", false );
            model.set("done", true );
            expect( status() ).toBe( "failed" );
	    var modelResults = model.getResults().details;
	    expect( modelResults.length ).toBe( 3 );
	    expect( modelResults[0] ).toEqual( { 
		index : 1, 
		text : "Fail message 0",
		passed : false
	    } );
	    expect( modelResults[1] ).toEqual( {
		index : 2, 
		passed : false,
		stackTrace : "Foo\nBar:85:86\n/KluJS/Stuff:10:23\nBaz:9:28",
		text : "Fail message 1"
	    } );
	    expect( modelResults[2] ).toEqual( { 
		index : 3, 
		text : "Passed.",
		passed : true
	    } );
	    
            mockSpec.mockResults = mockJasmine.makeMockResults( 5, 0 );
            model.set("done", false );
            model.set("done", true );
            expect( status() ).toBe( "passed" );
	    expect( model.getResults().details.length ).toBe( 5 );

            mockSpec.mockResults.skipped = true;
            model.set("done", false );
            model.set("done", true );
            expect( status() ).toBe( "skipped" );
        } );
        it( "Helps with description", function() {
            expect( new SpecModel().briefDescription() ).toBe( "" );
            expect( new SpecModel().fullDescription() ).toBe( "" );
            expect( model.briefDescription() ).toBe( "spec1" );
            expect( model.fullDescription() ).toBe( "spec1" );

            var suite = mockJasmine.standardSuite();
            var deepSpec = suite.mockSuites[0].mockSpecs[0];
            deepSpec.suite = suite.mockSuites[0];
            suite.mockSuites[0].parentSuite = suite;

            var m2 = new SpecModel();
            m2.set("spec", deepSpec );
            expect( m2.fullDescription() ).toBe( "suite6 suite5 spec3" );

        } );
    } );
} );
