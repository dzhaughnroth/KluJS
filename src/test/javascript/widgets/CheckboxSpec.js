/*global define:false, describe:false, it:false, expect:false */
define( [ "widgets/Checkbox" ], function( Checkbox ) {
    describe( "Checkbox", function() {
        var model = new Checkbox.Model( { label : "Hiyawlol" } );
        var cb1 = new Checkbox.View( { model:model } );
        var cb2 = new Checkbox.View( { model:model } );
        var lab = new Checkbox.Label({ model:model } );
        var checkSame = function() {
            var msg;
            msg = "1:" + cb1.$el.attr("checked") + "2:" + cb2.$el.attr("checked");
            if ( model.get("checked") ) {
                if ( msg !== "1:checked2:checked" ) {
                    throw msg;
                }
            }
            else {
                if ( msg !== "1:undefined2:undefined" ) {
                    throw msg;
                }
            }
        };

        cb1.render();
        cb2.render();
        lab.render();
        var ev1 = [],
            ev2 = [];
        cb1.model.on( "change", function( ) {
            ev1.push( arguments );
        } );
        cb2.model.on( "change", function( ) {
            ev2.push( arguments );
        } );
        it( "Initializes to unchecked state", function() {
            checkSame();
        } );
        it ( "Sets and follows model state", function() {
            cb1.toggle();
            checkSame();
            expect( model.get("checked") ).toBe( true );
            cb2.toggle();
            checkSame();
            expect( model.get("checked") ).toBe( false );
//            $("body").append( cb1.$el );
//            $("body").append( cb2.$el );
//            $("body").append( lab.$el );
        } );
        it ( "Label view tracks label changes, toggles on click", function() {
            model.set("label", "Other" );
            expect( lab.$el.text() ).toBe("Other");
            lab.$el.click();
            checkSame();
            expect( model.get("checked") ).toBe( true );
        } );
    } );
} );
