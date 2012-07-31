/*global define:false, describe:false, it:false, expect:false */
define( [ "jasmine/JasmineModel", "../MockJasmine.js"], function( JasmineModel, MockJasmine ) {
    var mockResults = [ {result:"passed"}, {result:"failed"}, {result:"passed"}];

    var mockJasmine = new MockJasmine(
        function() {
            return mockResults;
        }
    );
    describe( "JasmineModel", function() {
        var statusChanges = [];
        var resultChanges = [];
        var jm = new JasmineModel( { jasmineImpl : mockJasmine } );
        jm.on( "change:status", function( x ) {
            statusChanges.push( arguments );
        } );
        jm.on( "change:result", function( x ) {
            resultChanges.push( arguments );
        });
        it( "Initializes to neutral state", function() {
            expect( jm.get("jasmineImpl")).toBe( mockJasmine );
            expect( jm.get("status") ).toBe( "new" );
            expect( statusChanges ).toEqual( [] );
            expect( resultChanges ).toEqual( [] );
        } );
        it( "Tracks that jasmine tests are starting", function() {
            var reporter = mockJasmine.reporters[ mockJasmine.reporters.length -1 ];
            reporter.reportRunnerStarting(); // mock stating tests
            expect( jm.get("status") ).toBe( "running" );
            expect( statusChanges.length ).toEqual( 1 );
            expect( resultChanges.length ).toEqual( 0 );
        } );
        it( "Reports results when tests are finished", function() {
            var reporter = mockJasmine.reporters[ mockJasmine.reporters.length -1 ];
            reporter.reportRunnerResults(); // mock finished tests
            expect( statusChanges.length ).toEqual( 2 ); // status and result
            expect( jm.get( "status" ) ).toBe( "done" );
            var res = jm.get( "result" );
            expect( res.results ).toBe( mockResults );
            expect( res.count ).toBe( 3 );
            // check event that was emitted, bit redundant
            expect( res.failed ).toBe( 1 );
            expect( resultChanges.length ).toEqual( 1 );
            expect( resultChanges[0][0] ).toBe( jm );
            expect( resultChanges[0][1].count).toBe( 3 );
            expect( resultChanges[0][1].failed).toBe( 1 );
            expect( resultChanges[0][1].results ).toBe( mockResults );
       } );

    } );
} );
