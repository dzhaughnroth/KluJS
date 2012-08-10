/*global define:false, describe:false, it:false, expect:false */
define( [ "multi/MultiStarter", "Config", "notJQuery" ], function( MultiStarter, notKlujs, $ ) {

    describe( "MultiStarter", function() {
        var type;
        var listener;

        var mockWindow = {
            addEventListener : function( aType, aListener ) {
                type = aType;
                listener = aListener;
            }
        };
        var callback, errorCallback;
        var mockFetcher = {
            fetch : function( aCallback, anErrorCallback ) {
                callback = aCallback;
                errorCallback = anErrorCallback;
            }
        };

        var head = $("<div />");
        var body = $("<div />");
        var topic = new MultiStarter( head, body, mockWindow );
        it ( "Waits until started", function() {
            expect( listener ).toBeUndefined();
            expect( callback ).toBeUndefined();
            expect( errorCallback ).toBeUndefined();
            expect( topic.model.get("config") ).toBeUndefined();
            expect( topic.view.$el ).toBeDefined();
        } );
        it( "Should show failed/passed message on completion", function() {
            topic.fetcher = mockFetcher;
            topic.start();
            expect( listener ).toBeDefined();
            callback();
            expect( topic.model.get("config") ).toBe( notKlujs );
            expect( topic.model.get("failed") ).toBeUndefined();
            errorCallback("foo");
            expect( topic.model.get("failed")).toBe( true );
            expect( topic.model.get("failure")).toBe( "foo" );
        } );
        it( "Should add window handlers", function() {
            var checked, lintWork;
            topic.model = {
                check: function() { checked = true; },
                lintFound : function( x ) { lintWork = x; }
            };
            listener( { data : { messageType : "started" } } );
            listener( { data : { messageType : "goo" } } );
            expect( checked ).toBeUndefined();
            expect( lintWork ).toBeUndefined();
            listener( { data : { messageType : "finished" } } );
            expect( checked ).toBe( true );
            expect( lintWork ).toBeUndefined();
            listener( { data : { messageType : "lint", lintWork: "foo" } } );
            expect( lintWork ).toBe( "foo" );
        } );
    } );


} );
