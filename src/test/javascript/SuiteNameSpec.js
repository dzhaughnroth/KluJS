/*global define:false, describe:false, it:false, expect:false, runs:false, waits:false */
define( [ "SuiteName" ], function(SuiteName) {

    describe( "SuiteName Model and View", function() {
        var model = new SuiteName.Model();
        var lastValue;
        model.on( "change", function() { 
            lastValue = model.get( "suiteName" );
        } );
        var view = new SuiteName.View( { model:model } )
                .render();
        it( "Is empty by default", function() {
            expect( view.model ).toBe( model );
        } );
        it( "Renders suiteName property", function() {
            model.set( "suiteName", "foo" );
            expect( lastValue ).toBe( "foo" );
            expect(model.get("suiteName")).toBe( "foo" );
            expect( view.$el.text().indexOf( "foo" ) > 0 ).toBe( true );
        } );
    } );
} );
