/*global define:false, describe:false, it:false, expect:false */
define( [ "multi/FailureDetailsView", "notBackbone", "notJQuery", "notUnderscore" ], function( FailureDetailsView, Backbone, $, _ ) {

    describe( "FailureDetailsView", function() {
	var done = false;
        var model = new Backbone.Model();
	model.isDone = function() { return done; };
	model.getFailedSpecDetails = function() { return { 1 : "goo", 2: "boo" }; };
	var topic = new FailureDetailsView( { model:model } ).render();
	$("body").append( topic.$el );
        it ( "Start empty", function() {
	    expect( topic.$el.text() ).toBe( "Not all done yet." );
        } );
        it( "Updates on changes", function() {
	    done = true;
	    model.set( "z", "Foo" );
	    //	    expect( topic.$el.children( ).length ).toBe( 1 );
	    //	    expect( topic.$el.children( )[0].text() ).toBe( "Foo" );
	    var text = topic.$el.children("pre").text();
	    expect( JSON.parse( text ) ).toEqual( model.getFailedSpecDetails() );
	} );
        it( "fails intentionally", function() {
	    expect( 2+ 2 ).toBe( 4 );
	    expect( 2+ 2 ).toBe( 5 );
	    expect( 2+ 2 ).toBe( 4 );
	    expect( 2+ 2 ).toBe( 7 );
	} );
        it( "also fails intentionally", function() {
	    expect( 2+ 2 ).toBe( 4 );
	    expect( 2+ 2 ).toBe( 8 );
	    expect( 2+ 2 ).toBe( 4 );
	    expect( 2+ 2 ).toBe( 9 );
	} );

    } );
    

} );
