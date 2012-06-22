/*global define:false, describe:false, it:false, expect:false, jasmine:false */
define( [ "multi/ChildFrameManager" ], function( ChildFrameManager ) {

    describe( "ChildFrameManager", function() {
        // FIXME muahahaha
        var suite = "Suiteness";
        var topic = new ChildFrameManager( { suite: suite } );
        var mockValues = [];
        var mockTopic = function() {
            topic.plainFrame = {
                contentWindow : {
                    klujsAssembly : {
                        jasmine : {
                            get : function() {
                                return mockValues.shift();
                            }
                        }
                    }
                }
            };
        };
        

        it ( "Should have id, suite, and frame to computed src", function() {
            expect( topic.frame.is( "iframe" ) ).toBe( true );
            expect( topic.get("status") ).toBe( "running" );
            expect( topic.get("suite") ).toBe( suite );
            expect( topic.frame.attr("src") ).toBe( topic.pathFactory( suite ));
        } );
        it( "Should report onload events", function() {
            expect( topic.get( "loaded" ) ).toBe( false );
            topic.plainFrame.onload();
            expect( topic.get( "loaded" ) ).toBe( true );
            
        } );
        it( "Should reflect if child is running", function() {
            mockTopic();
            mockValues = [ "running" ];
            topic.check();
            expect( topic.get("status" ) ).toBe( "running" );
        } );
        
        it( "Should be able to report pass/fail counts after checking", function() {
            mockTopic();
            mockValues = [ "done", {failed: 7, count:31092} ];
            topic.check();
            expect( topic.get("results").failedCount ).toBe( 7 );
            expect( topic.get("results").passedCount ).toBe( 31085 );
            expect( topic.get("results").count ).toBe( 31092 );
            expect( topic.get("status" ) ).toBe( "failed" );

            mockValues = [ "done", { failed: 0, count:8 } ];
            topic.check();
            expect( topic.get("results").failedCount ).toBe( 0 );
            expect( topic.get("results").passedCount ).toBe( 8 );
            expect( topic.get("status" ) ).toBe( "passed" );
        } );
    } );


} );
