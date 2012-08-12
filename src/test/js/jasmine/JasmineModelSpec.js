/*global define:false, describe:false, it:false, expect:false, runs:false, waitsFor:false, waits:false */
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
        it( "Runs specs asynchronously", function() {
            var err;
            var errback = function( x ) { err = x; };               
            runs( function() {
                expect( mockJasmine.executed ).toBe( false );            
                jm.runSpecs( [ "src/test/js/coverage/fixture/simple.js" ], errback );
            } );
            waitsFor( function() { return mockJasmine.executed; }, 1000 );
            runs( function() {
                mockJasmine.executed = false;
                mockJasmine.getEnv().execute = function() { throw "sabotage"; };
                jm.runSpecs( [  ], errback );
            } );
            waitsFor( function() { return err; } );
            runs( function() {
                //expect( mockJasmine.executed ).toBe( true );
                expect( err ).toBe( "sabotage" );
                expect(jm.get("status")).toBe( "error" );
                jm.set("status", "new" );
                err = undefined;
                jm.runSpecs( [ ] );
            } );
            waits( 100 );
            runs( function() {
                expect( jm.get("status")).toBe( "error" );
            } );
                  

            
            
        } );


    } );
} );
