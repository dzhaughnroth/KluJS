/*global define:false, describe:false, it:false, expect:false */
define( [ "multi/MultiPage", "jquery" ], function( MultiPage, $ ) {

    describe( "MultiPage", function() {
        var head = $("<div />" );
        var body = $("<div />" );
        var config = { 
            suites: {
                Foo: ["foospec", "foofoospec"],
                Bar: ["barspec"]
            }
        };
        var topic = new MultiPage( head, body, config );
        it( "Should add css links to html head", function() {
            expect( head.children( "link" ).length ).toBe( 3 );
        } );
        it( "Should add stuff to html body", function() {
            expect( body.children( "div.childFrameContainer" ).length ).toBe( 1 );
            expect( body.children( "div.lintCollectionView" ).length ).toBe( 1 );
            expect( body.find( "iframe" ).length ).toBe( 2 );
            $("body").append( body );
        } );


    } );


} );
