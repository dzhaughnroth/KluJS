/*global define:false, describe:false, it:false, expect:false, $$_l:false */
define( [ "coverage/CoverageDataModel", "coverage/CoverageDataView", "./fixture/trinary.js", "jquery", "./fixture/simple.js", "./fixture/target.js" ], function( CoverageDataModel, CoverageDataView, $ ) {

    describe( "CoverageDataView", function() {
        var model = new CoverageDataModel.ProjectModel();
        var view = new CoverageDataView( { model:model,
                                           label:"Foo" } );
        view.render();
        model.setData( $$_l );

        it( "Should be a div with a datatable", function() {
            
            expect( view.$el.hasClass( "coverageDataView" ) ).toBe( true );
            expect( view.$el.is( "div" ) ).toBe( true );

//            $("body").append( view.$el );
            var table = view.$el.find( "table" );
            var banners = view.$el.children( "div.coverageBanner" );
            expect( banners.length ).toBe( 1 );
            expect( banners.children(".coverageTitle").text() ).toBe( "Foo" );

            expect( view.$el.children( "div" ).length ).toBe( 2 );
            expect( table.length ).toBe( 1 );
            expect( table.find( "th" ).length ).toBe( 8 ); // 8 columns
            expect( table.find( "tr" ).length > 5 ).toBe( true ); // many rows
        } ); 
        it( "Should support filtering", function() {
            var view2 = new CoverageDataView( { 
                model:model,
                filter: function(x) {
                    return x.get( "src" ).match( /fixture/ );
                }
            } ).render();
//            $("body").append( view2.$el );
            var table = view2.$el.find( "table" );
            expect( table.find( "tbody tr" ).length ).toBe( 3 );
        } );
    } );
} );
