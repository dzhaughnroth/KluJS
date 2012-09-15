/*global define:false, describe:false, it:false, expect:false */
define( [ "multi/ChildFrameModel" ], function( ChildFrameModel ) {

    describe( "ChildFrameModel", function() {
        // FIXME muahahaha
        var suite = "Suiteness";
        var topic = new ChildFrameModel( { suite: suite } );
        var mockStatus = "new";
        var counts = { };
        var mockRunner = {
            results : function() { return counts; }
        };
        var mockValues = [];
        var mockDead = [];
        var mockTopic = function() {
            topic.plainFrame = {
                contentWindow : {
                    klujsAssembly : {
                        runnerModel : {
                            get : function(x) {
                                if ( x === "status" ) {
                                    return mockStatus;
                                }
                                if ( x === "runner" ) {
                                    return mockRunner;
                                }
                                if ( x === "done" ) {
                                    return mockStatus === "failed" 
                                        || mockStatus === "passed";
                                }
                            },
                            getCounts : function() {
                                return counts;
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
            mockStatus = "running";
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
            mockStatus = "failed";
            counts.failedCount = 2;
            counts.totalCount = 12;
            counts.passedCount = 10;
            mockDead = [ { dead : [], undead : [], exceptions : [] } ];
            topic.check();
            expect( topic.get("results") ).toBe( counts );
            expect( topic.get("status" ) ).toBe( "failed" );
            expect( topic.get("coverageGoalFailures" ) ).toBe( 171 );

            counts.failedCount = 0;
            counts.totalCount = 8;
            mockValues = [ { results : function() { return counts; }} ];
            topic.check();
            expect( topic.get("results") ).toBe( counts );
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
