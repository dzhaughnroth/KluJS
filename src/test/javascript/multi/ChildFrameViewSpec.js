/*global define:false, describe:false, it:false, expect:false */
define( [ "multi/ChildFrameView", "notJQuery" ], function( ChildFrameView, $ ) {

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

        var expectedText = [];
        var checkText = function( ) {
            $.each( topic.$el.find("td"), function( i, td ) {
                expect( $(td).text() ).toBe( expectedText[i] );
            } );
        };
        var cell = function( i ) {
            return $(topic.$el.find("td")[i] );
        };

        it ( "Should report running status", function() {
            expect( topic.$el.is( "tr" ) ).toBe( true );
            expectedText = [ "Suiteness", "...Running...", "Missed 172 goal(s)", "---" ];
            checkText();
            expect( lastType ).toBe( "change" );
        } );
        it( "Should show failed/passed message on completion", function() {
            mockVals.status = "failed";
            mockVals.results = { 
                failedCount : 3,
                count : 7,
                passedCount : 4
            };
            mockVals.deadCodeResult = { dead: [], undead: [], permitted:[] };
            mockVals.coverageGoalFailures = 0;
            lastCallback( );
            expectedText[1] = "Failed 3 of 7 specs";
            expectedText[2] = "Ok"; 
            expectedText[3] = "Ok";
            checkText();            
            mockVals.status = "passed";
            mockVals.results = { 
                failedCount : 0,
                count : 6,
                passedCount : 6
            };
            mockVals.coverageGoalFailures = 8;
            lastCallback();
            expectedText[1] = "Passed all 6 specs";
            expectedText[2] = "Missed 8 goal(s)";
            checkText();
        } );
        it( "Should report errors", function() {
            mockVals.status = "error";
            mockVals.error = {message:"foo"};
            lastCallback();
            expectedText[1] = "Error";
            checkText();
        } );
        it( "Should alter visibility of frames, referenced by id", function() {
            expect( topic.model.frame.hasClass( "hidden" ) ).toBe( true );
            topic.selectFrame();
            expect( topic.model.frame.hasClass( "hidden" ) ).toBe( false );
            topic.selectFrame();
            expect( topic.model.frame.hasClass( "hidden" ) ).toBe( true );
        } );
        it( "Should display dead code information", function() {
            expect( cell(3).hasClass( "deadCodeOk" ) );
            mockVals.deadCodeResult = { dead: ["Noo"], undead: ["Zoo"], permitted:["Xoo","Yoo"] };
            topic.render();
            expectedText[3] = '1 dead; 1 undead; 2 permitted';
            checkText();
            expect( cell(3).hasClass( "deadCodeFailed" ) );
            mockVals.deadCodeResult = { dead: [], undead: [], permitted:["Xoo","Yoo"] };
            topic.render();
            expectedText[3] = 'Ok; 2 permitted';
            expect( cell(3).hasClass( "deadCodeFailed" ) );
        } );
    } );


} );
