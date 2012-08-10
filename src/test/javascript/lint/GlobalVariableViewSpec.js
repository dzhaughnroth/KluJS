/*global define:false, describe:false, it:false, expect:false, runs:false, waitsFor:false */
define( [ "lint/LintView", "lint/LintModel", "lint/LintCollection", "lint/GlobalVariableView", "notUnderscore", "notJQuery" ], function( LintView, LintModel, LintCollection, GlobalVariableView, _, $ ) {

    describe( "GlobalVariableView", function() {
        var model = new LintCollection( );
        model.add( new LintModel( { src: "src/test/javascript/lint/LintCollectionViewSpec.js" } ) );
        var view = new GlobalVariableView( { model:model } ).render();
        $("body").append( view.$el );
        it( "Renders as a div with certain class name", function() {
            expect( model.modelsBySrc ).toEqual( {} );
            expect( view.$el.hasClass( "lintGlobalVariableReport" ) ).toBe( true );
            expect( view.$el.is( "div" ) ).toBe( true );
            expect( view.$el.find("ul").children().length ).toBe( 0 );
        } );        
        it( "Updates as lintData arrives", function() {
            model.at(0).set("lintData", { globals: ["foo", "bar"] });
            expect( view.$el.find( "li" ).length ).toBe( 2 );            
        } );        
    } );
} );
