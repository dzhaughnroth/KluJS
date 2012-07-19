/*global define:false, describe:false, it:false, expect:false, beforeEach:false, window:false */
define( [ "ParentMessagePoster" ], function( ParentMessagePoster) {

    describe( "ParentMessagePoster", function() {
        var lastMsg, lastLoc;
        var mockWindow = {
            parent : {
                postMessage : function( msg, loc ) {
                    lastMsg = msg;
                    lastLoc = loc;
                } 
            },
            location : {here:"here"}
        };
        var topic = new ParentMessagePoster( mockWindow );
        beforeEach( function() {
            lastMsg = undefined;
            lastLoc = undefined;
        } );
        it( "Uses window global by default", function() {
            expect( new ParentMessagePoster().window ).toBe( window );
        } );
        it( "Posts when possible", function() {
            expect( topic.postToParent( "foo" )).toBe( true );
            expect( lastMsg ).toBe( "foo" );
            expect( lastLoc ).toEqual( { here:"here"} );
        } );
        it( "Does not post when inappropriate", function() {
            mockWindow.parent.window = mockWindow;
            expect( topic.postToParent( "foo" )).toBe( false );
            expect( lastMsg ).toBeUndefined( );
            mockWindow.parent.postMessage = undefined;
            expect( topic.postToParent( "foo" )).toBe( false );
            expect( lastMsg ).toBeUndefined( );
            mockWindow.parent = undefined;
            expect( topic.postToParent( "foo" )).toBe( false );
            expect( lastMsg ).toBeUndefined( );

        } );
    } );
} );
