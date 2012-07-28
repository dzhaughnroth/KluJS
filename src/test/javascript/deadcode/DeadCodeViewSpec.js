/*global define:false, describe:false, it:false, expect:false, beforeEach:false, runs:false, waitsFor:false, klujs:false */
define( [ "deadcode/DeadCodeView", "deadcode/DeadCodeModel", "jquery" ], function( DeadCodeView, DeadCodeModel, $ ) {

    describe( "DeadCodeView", function() {
        var mockModel = { get: function() { return; },
                          on: function() {} };
        var model = new DeadCodeModel( { codeListModel : mockModel,
                                         coverageDataModel : mockModel } );       
        var topic = new DeadCodeView( { model: model } ).render();
        it( "Initially Pending", function() {
            expect( $(topic.$el.children()[0]).text() ).toBe( "Dead Code" );
            expect( $(topic.$el.children()[1]).text() ).toBe( "Pending..." );
        });
        it( "Displays dead code list", function() {
            model.set( "deadCode", ["foo", "bar", "baz" ] );
            var li = topic.$el.find( ".deadCodeReport ul li" );
            var itemText = [];
            $.each( li, function( i, x ) { itemText.push( $(x).text() );} );
            expect( itemText ).toEqual( ["foo", "bar", "baz"] );
            expect( topic.$el.find( ".deadCodeBanner" ).hasClass( "failed" ) ).toBe(true);
            expect( topic.$el.find( ".deadCodeBanner" ).hasClass( "passed" ) ).toBe(false);
            model.set( "deadCode", [ ] );
            expect( topic.$el.find(".deadCodeReport").text()).toBe( "All Ok." );
            expect( topic.$el.find( ".deadCodeBanner" ).hasClass( "passed" ) ).toBe(true);
            expect( topic.$el.find( ".deadCodeBanner" ).hasClass( "failed" ) ).toBe(false);

            $("body").append( topic.$el );
            
        } );

    } );

} );
