/*global define:false, describe:false, it:false, expect:false */
define( [ "multi/ChildFrameModel" ], function( ChildFrameModel ) {

    describe( "ChildFrameModel", function() {
        // FIXME muahahaha
        var suite = "Suiteness";
        var topic = new ChildFrameModel( { suite: suite } );
        var mockValues = [];
        var mockDead = [];
        var mockTopic = function() {
            topic.plainFrame = {
                contentWindow : {
                    klujsAssembly : {
                        jasmine : {
                            get : function() {
                                return mockValues.shift();
                            }
                        },
                        goalFailureCount : function() {
                            return 171;
                        },
                        deadCode : {
                            get : function() {
                                return mockDead.shift();
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
            expect( topic.get("coverageGoalFailures" ) ).toBeUndefined();

            // code coverage for check of the existence of a contentWindow.
            topic.plainFrame.contentWindow = null;            
            topic.check();
            expect( topic.get("status" ) ).toBe( "running" );

            topic.plainFrame.contentWindow = {};
            topic.check();
            expect( topic.get("status" ) ).toBe( "running" );
        } );
        
        it( "Should be able to report pass/fail counts after checking", function() {
            mockTopic();
            mockValues = [ "done", {failed: 7, count:31092} ];
            mockDead = [ { dead : [], undead : [], exceptions : [] } ];
            topic.check();
            expect( topic.get("results").failedCount ).toBe( 7 );
            expect( topic.get("results").passedCount ).toBe( 31085 );
            expect( topic.get("results").count ).toBe( 31092 );
            expect( topic.get("status" ) ).toBe( "failed" );
            expect( topic.get("coverageGoalFailures" ) ).toBe( 171 );

            mockValues = [ "done", { failed: 0, count:8 } ];
            topic.check();
            expect( topic.get("results").failedCount ).toBe( 0 );
            expect( topic.get("results").passedCount ).toBe( 8 );
            expect( topic.get("status" ) ).toBe( "passed" );
            expect( topic.get("coverageGoalFailures" ) ).toBe( 171 );
        } );
        it( "Should report errors", function() {
            mockTopic();
            var theError = {message:"foo"};
            topic.plainFrame.contentWindow.klujsAssembly.error = theError;
            topic.check();
            expect( topic.get("status") ).toBe( "error" );
            expect( topic.get("error") ).toBe( theError );
        } );


    } );


} );
