/*global define:false, describe:false, it:false, expect:false, runs:false, waits:false */
define( [ "suite/SuiteAssembly", "../jasmine/MockJasmine.js" ], function(SuiteAssembly, MockJasmine) {
    
    describe( "SuiteAssembly", function() {
        var lastMsg, lastLoc;
        var messages = [];
        var mockWindow = {
            parent : {
                postMessage : function( msg, loc ) {
                    messages.push( msg );
                    lastMsg = msg.messageType;
                    lastLoc = loc;
                } 
            },
            location : {here:"here"}
        };
        var mockJasmine = new MockJasmine();
        var mockRunner = mockJasmine.standardRunner();
        var topic = new SuiteAssembly( mockWindow, mockJasmine.mockImpl );
        it( "Has a name model linked to a FocusFilterFactory", function() {
            expect( topic.name ).toBeDefined();
            var prevFilter = topic.filter;
            expect( topic.filter() ).toBe( true ); // trivial filter initially
            topic.name.set( "suiteName", "goo" );
            expect( topic.filter ).not.toBe( prevFilter );
        } );
        it( "Notifies parent on test start", function() {

            expect( topic.runnerModel.get("status")).toBeUndefined();
            topic.runnerModel.jasmineReporter.reportRunnerStarting( mockRunner );
            expect( topic.runnerModel.get("status")).toBe( "running" );
            expect( lastMsg ).toBe( "started" );
            expect( lastLoc ).toBe( mockWindow.location );
            expect( topic.lint ).toBeDefined();
            expect( topic.lint.length ).toBe( 0 );
            expect( topic.coverage ).toBeDefined();
            expect( topic.coverage.calculator ).not.toBeDefined(); 
        });
        describe( "Updates lint and coverage models", function() {
            it( "Computes coverage", function() {
                mockJasmine.applyMockResults( mockRunner, 0, 2 );
                topic.runnerModel.jasmineReporter.reportRunnerResults( );                
                expect( topic.coverage.calculator ).toBeDefined();
                expect( lastMsg ).toBe( "finished" );
                expect( lastLoc ).toBe( mockWindow.location );
            } );
            it ( "Notifies and delegates lint work to parent window, if any", function() {
                var lintMsg = messages[ messages.length - 2 ];
                expect( lintMsg.messageType ).toBe( "lint" );
                expect( lintMsg.lintWork.allModules.length > 5 ).toBe( true );
                expect( topic.lint.length ).toBe( 0 );
                expect( lastMsg ).toBe( "finished" );
                expect( lastLoc ).toBe( mockWindow.location );
            } );
            it( "Uses lintModel if no parent", function() {
                var noParentTopic = new SuiteAssembly( {}, mockJasmine.mockImpl ); 
                noParentTopic.runnerModel.jasmineReporter.reportRunnerStarting( mockRunner );
                noParentTopic.runnerModel.set( "done", true );
                expect( noParentTopic.lint.length >5 ).toBe( true );
            } );
        });
        it( "Will count goal Failures against filter", function() {
            expect( topic.goalFailureCount() ).toBe( topic.coverage.goalFailureCount( topic.filter ) );
        } );
        it( "Posts message on failure", function() {
            topic.fail( "foo" );
            expect( topic.error ).toBe( "foo" );
            expect( lastMsg ).toBe( "finished" ); 
        } );
    } );
} );