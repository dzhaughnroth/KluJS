/*global define:false, describe:false, it:false, expect:false */
define( [ "multi/ChildFrameView", "jquery" ], function( ChildFrameView, $ ) {

    describe( "ChildFrameView", function() {
        var lastType, lastCallback;
        var mockVals = { status:"running", suite:"Suiteness", coverageGoalFailures:172 };
        var model = {
            on : function( type, callback ) {
                lastType = type;
                lastCallback = callback;
            },
            get : function( attr ) {
                return mockVals[attr];
            },
            frame : $("<div />").addClass( "hidden" )
        };

        var topic = new ChildFrameView( { model : model } ).render();
 //       var table = $("<table />").appendTo( $("body" ));
 //       table.append( topic.$el );
        it ( "Should report running status", function() {
            expect( topic.$el.is( "tr" ) ).toBe( true );
            expect( topic.$el.text() ).toBe( "Suiteness...Running...Missed 172 goal(s)" );
            expect( lastType ).toBe( "change" );
        } );
        it( "Should show failed/passed message on completion", function() {
            mockVals.status = "failed";
            mockVals.results = { 
                failedCount : 3,
                count : 7,
                passedCount : 4
            };
            mockVals.coverageGoalFailures = 0;
            lastCallback( );

            
            expect( topic.$el.text() ).toBe( "SuitenessFailed 3 of 7 specsOk" );
            mockVals.status = "passed";
            mockVals.results = { 
                failedCount : 0,
                count : 6,
                passedCount : 6
            };
            mockVals.coverageGoalFailures = 8;
            lastCallback();
            expect( topic.$el.text() ).toBe( "SuitenessPassed all 6 specsMissed 8 goal(s)" );            
        } );
        it( "Should alter visibility of frames, referenced by id", function() {
            expect( topic.model.frame.hasClass( "hidden" ) ).toBe( true );
            topic.selectFrame();
            expect( topic.model.frame.hasClass( "hidden" ) ).toBe( false );
            topic.selectFrame();
            expect( topic.model.frame.hasClass( "hidden" ) ).toBe( true );
        } );
    } );


} );
