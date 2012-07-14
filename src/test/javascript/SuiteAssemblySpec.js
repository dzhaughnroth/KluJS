/*global define:false, describe:false, it:false, expect:false, runs:false, waits:false */
define( [ "SuiteAssembly" ], function(SuiteAssembly) {

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
        var topic = new SuiteAssembly( mockWindow );
        it( "Has a model for the name of the suite", function() {
            expect( topic.name ).toBeDefined();
        } );
        it( "Notifies parent on test start", function() {
            expect( topic.jasmine.get("status")).toBe( "running" );
            expect( topic.jasmine.get("status")).toBe( "running" );
            expect( lastMsg ).toBe( "started" );
            expect( lastLoc ).toBe( mockWindow.location );
            expect( topic.lint ).toBeDefined();
            expect( topic.lint.length ).toBe( 0 );
            expect( topic.coverage ).toBeDefined();
            expect( topic.coverage.calculator ).not.toBeDefined(); 
        });
        describe( "Updates lint and coverage models", function() {
            it( "Computes coverage", function() {
                topic.jasmine.set( "status", "done" );
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
                var noParentTopic = new SuiteAssembly( {} );
                noParentTopic.jasmine.set( "status", "done" );
                expect( noParentTopic.lint.length >5 ).toBe( true );
            } );
        });
    } );
} );
