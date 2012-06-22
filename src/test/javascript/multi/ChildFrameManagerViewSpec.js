/*global define:false, describe:false, it:false, expect:false, jasmine:false */
define( [ "multi/ChildFrameManagerView" ], function( ChildFrameManagerView ) {

    describe( "ChildFrameManagerView", function() {
        var lastType, lastCallback;
        var mockVals = { status:"running", suite:"Suiteness" };
        var model = {
            on : function( type, callback ) {
                lastType = type;
                lastCallback = callback;
            },
            get : function( attr ) {
                return mockVals[attr];
            }
        };

        var topic = new ChildFrameManagerView( { model : model } ).render();
        it ( "Should report running status", function() {
            expect( topic.$el.is( "tr" ) ).toBe( true );
            expect( topic.$el.text() ).toBe( "Suiteness...Running..." );
            expect( lastType ).toBe( "change" );
        } );
        it( "Should show failed/passed message on completion", function() {
            mockVals.status = "failed";
            mockVals.results = { 
                failedCount : 3,
                count : 7,
                passedCount : 4
            };
            lastCallback( );
            expect( topic.$el.text() ).toBe( "SuitenessFailed 3 of 7 specs" );
            mockVals.status = "passed";
            mockVals.results = { 
                failedCount : 0,
                count : 6,
                passedCount : 6
            };
            lastCallback();
            expect( topic.$el.text() ).toBe( "SuitenessPassed all 6 specs" );            
        } );
        it( "Should alter visibility of frames, referenced by id", function() {
//            expect( topic.model.frame.hasClass( "hidden" ) ).toBe( true );

        } );
    } );


} );
