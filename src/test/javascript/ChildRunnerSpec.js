/*globals define:false, describe:false, it:false, expect:false */
define( ["KluJS/childRunner", "jquery"], function( crMod, $ ) {
    describe( "The ChildRunner Module ", function() {
        var lastStatus;

        it ( "Has correct initial state", function() {
            var cr = new crMod.ChildRunner( 0, "foo" );
            expect( cr.id ).toBe( 0 );
            expect( cr.path ).toBe( "foo" );
            expect( $(cr.frame).attr("src" )).toEqual( "foo" );
            expect( cr.status ).toBe( "running" );
            expect( cr.isDone() ).toBe( false );
            expect( cr.isPassed() ).toBe( false );
            expect( cr.isFailed() ).toBe( false );
         } );
        it( "Checks and notifies on status", function() {
            var cr = new crMod.ChildRunner( 0, "bar");
            cr.listeners.push( function( status ) { 
                lastStatus = status;

            } );
            var mockApiReporter = { finished:false };
            lastStatus = undefined;
            cr.check();
            expect( cr.status ).toBe( "running" );
            expect( lastStatus ).toBe( "running" );
            cr.frame = { contentWindow: { apiReporter: mockApiReporter} }; 
            lastStatus = undefined;
            cr.check();
            expect( lastStatus ).toBe( "running" );
            mockApiReporter.finished = true;
            mockApiReporter.results = function() {
                return [ { result : "passed" } ];
            };
            cr.check();
            expect( lastStatus ).toBe( "passed" );
            mockApiReporter.results = function() {
                return [ { result : "passed" }, 
                         { result : "failed" },
                         { result: "passed" }];
            };
            cr.check();
            expect( lastStatus ).toBe( "failed" );
            expect( cr.status ) .toBe( "failed" );
            expect( cr.isFailed() ).toBe( true );
            expect( cr.isPassed() ).toBe( false );
        } );
        it( "Returns result arrays", function() {
            var cr = new crMod.ChildRunner( 0, "bar");
            var mockApiReporter = { finished:false };
            cr.frame = { contentWindow: { apiReporter: mockApiReporter} }; 
            mockApiReporter.suites = function() {
                return [{ type:"spec", name:"foo", id:"bar" }];
            };
            mockApiReporter.resultsForSpecs = function(x) {
                var result = {};
                result[x] = { messages : [ { message:"zoot", passed: false, 
                                           trace: {} } ] };
                return result;
            };
            var results = cr.getResults();
            expect( results.length ).toBe( 1 );
            var result = results[0];
            expect( result.message ).toBe( "zoot" );
        } );
    } );
} );
