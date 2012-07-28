/*global define:false, describe:false, it:false, expect:false, beforeEach:false, runs:false, waitsFor:false, klujs:false */
define( [ "deadcode/DeadCodeModel", "deadcode/CodeListModel", "lib/notBackbone" ], function( DeadCodeModel, CodeListModel, Backbone ) {

    describe( "DeadCodeModel", function() {
        var codeListModel = new CodeListModel();
        var MockCdm = Backbone.Model.extend( {} );
        var coverageDataModel = new MockCdm();
        var topic = new DeadCodeModel( { codeListModel : codeListModel,
                                         coverageDataModel : coverageDataModel } );       
        var lastEvent;
        topic.on( "change", function() {
            lastEvent = arguments;
        } );
        expect( lastEvent ).toBeUndefined();
        beforeEach( function() { lastEvent = undefined; } );
        it( "Initially empty", function() {
            expect( topic.get("deadCode") ).toBeUndefined();
        });
        it( "Waits for both codeList and coverage data", function() {
            codeListModel.set( "codeList", [ "foo", "bar", "baz" ] );
            expect( lastEvent ).toBeUndefined();            
            coverageDataModel.set( "coverageData", {
                lines : {
                    "bar" : [1,2,3,4]
                }
            } );
            expect( lastEvent[1] ).toEqual( { changes : { deadCode : true } });
            expect( topic.get( "deadCode" ) ).toEqual( ["foo", "baz"] );
        } );

    } );

} );
