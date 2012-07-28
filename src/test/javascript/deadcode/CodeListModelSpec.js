/*global define:false, describe:false, it:false, expect:false, beforeEach:false, runs:false, waitsFor:false, klujs:false */
define( [ "deadcode/CodeListModel" ], function( CodeListModel ) {

    describe( "CodeListModel", function() {
        var topic = new CodeListModel( {
            src:"src/test/javascript/deadcode/mockCodeListResponse.json"
        } );
        it( "Fetches with ajax", function() {
            runs( function() { topic.fetch(); } );
            waitsFor( function() { return topic.get("codeList") !== undefined; }, 
                      200 );
            runs( function() {
                expect( topic.get("codeList").length > 2 );
            } );
        } );
        it( "Reports errors", function() {
            var badtopic = new CodeListModel( {
                src:"src/test/javascript/deadcode/nothing.json"
            } );
            runs( function() { badtopic.fetch(); } );
            waitsFor( function() { return badtopic.get("error") !== undefined; }, 
                      200 );
            runs( function() {
                expect( badtopic.get("codeList") ).toBeUndefined();
                expect( badtopic.get("error")[0].status ).toBe( 404 );
                //                expect( topic.get("codeList").length > 2 );
            } );
        } );
    } );

} );