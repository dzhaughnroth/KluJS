/*global define:false, describe:false, it:false, expect:false, beforeEach:false, runs:false, waitsFor:false, klujs:false */
define( [ "deadcode/DeadCodeView", "deadcode/DeadCodeModel", "notJQuery" ], function( DeadCodeView, DeadCodeModel, $ ) {

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
            var deadCode = {
                dead: ["foo", "bar"],
                undead: ["baz"],
                permitted: [ "glug" ]
            };
            model.set( "deadCode", deadCode );

            var extractText = function( type ) { 
                var items =  topic.$el.find( "." + type );
                var result = [];
                $.each( items, function( i, x ) {
                    result.push( $(x).text() ); 
                } );
                return result;
            };
            var rebuilt = { 
                dead : extractText( "dead" ),
                undead : extractText( "undead" ),
                permitted: extractText( "permitted" )
            };
            expect( rebuilt ).toEqual( deadCode ); 
            var itemText = [];
            var li = topic.$el.find( "li" );
            $.each( li, function( i, x ) { itemText.push( $(x).text() );} );
            expect( itemText ).toEqual( ["foo", "bar", "baz", "glug"] );
            expect( topic.$el.find( ".deadCodeBanner" ).hasClass( "failed" ) ).toBe(true);
            expect( topic.$el.find( ".deadCodeBanner" ).hasClass( "passed" ) ).toBe(false);
            model.set( "deadCode", { } );
            expect( topic.$el.find( ".deadCodeBanner" ).hasClass( "passed" ) ).toBe(true);
            expect( topic.$el.find( ".deadCodeBanner" ).hasClass( "failed" ) ).toBe(false);
        } );

    } );

} );
