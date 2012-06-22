/*global define:false, describe:false, it:false, expect:false, $$_l:false */
define( [ "coverage/CoverageDataModel", "coverage/CoverageDataView", "./fixture/trinary.js", "./fixture/simple.js", "./fixture/target.js" ], function( CoverageDataModel, CoverageDataView ) {

    describe( "CoverageDataView", function() {
        var model = new CoverageDataModel.ProjectModel();
        var view = new CoverageDataView( { model:model } );
        model.setData( $$_l );
        view = view.render();
        it( "Should be a div with a datatable", function() {
            
            expect( view.$el.hasClass( "coverageDataView" ) ).toBe( true );
            expect( view.$el.is( "div" ) ).toBe( true );

//            $("body").append( view.$el );
            var table = view.$el.find( "table" );
            expect( view.$el.children( "div.coverageBanner" ).length ).toBe( 1 );
            expect( view.$el.children( "div" ).length ).toBe( 2 );
            expect( table.length ).toBe( 1 );
            expect( table.find( "th" ).length ).toBe( 8 ); // 8 columns
            expect( table.find( "tr" ).length > 5 ).toBe( true ); // many rows
        } ); 
    } );
} );
