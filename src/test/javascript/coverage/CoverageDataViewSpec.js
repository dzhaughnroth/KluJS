/*global define:false, describe:false, it:false, expect:false, $$_l:false */
define( [ "coverage/CoverageDataModel", "coverage/CoverageDataView", "goals/SuiteInterpreter", "SuiteName", "jquery", "./fixture/trinary.js", "./fixture/simple.js", "./fixture/target.js" ], function( CoverageDataModel, CoverageDataView, SuiteInterpreter, SuiteName, $ ) {

    describe( "CoverageDataView", function() {
        var filter = function(x) {
            return x.get("src").match( /fixture/ );
        };

        var goalConfig = {
            lineCoverage: {
                max : 0
            },
            elementCoverage : {
                min : 0.5,
                except : {
                    rulez: {
                        files: [ "trinary" ],
                        max : 6,
                        min : 0.8
                    }
                }
            }
        };
        var name = new SuiteName.Model();
        name.set( "suiteName", "whatever" );
        var goals = new SuiteInterpreter( name, goalConfig.lineCoverage
                                          , goalConfig.elementCoverage );        
        var model = new CoverageDataModel.ProjectModel();
        var plainView = new CoverageDataView( { model:model,
                                           label:"Foo" } );
        plainView.render();

        var view = new CoverageDataView( { model:model,
                                           label:"FilterFoo",
                                           filter:filter,
                                           goals : goals } );
        model.setData( $$_l );
        view.render(); // for variety.
        $("body").append( view.$el );

        it( "Should be a div with a datatable", function() {
            
            expect( plainView.$el.hasClass( "coverageDataView" ) ).toBe( true );
            expect( plainView.$el.is( "div" ) ).toBe( true );

            var table = plainView.$el.find( "table" );
            var banners = plainView.$el.children( "div.coverageBanner" );
            expect( banners.length ).toBe( 1 );
            expect( banners.children(".coverageTitle").text() ).toBe( "Foo" );

            expect( plainView.$el.children( "div" ).length ).toBe( 2 );
            expect( table.length ).toBe( 1 );
            expect( table.find( "th" ).length ).toBe( 8 ); // 8 columns
            expect( table.find( "tbody tr" ).length > 8).toBe( true ); ///lots
        } ); 
        it( "Should support filtering", function() {
            var table = view.$el.find( "table" );
            expect( table.find( "tbody tr" ).length ).toBe( 3 );
        } );
        it( "Should highlight coverage shortcomings", function() {
            var failures = view.$el.find( ".coverageGoalFailed" );
            expect( failures.length ).toBe( 2 );
            var rows = view.$el.find( "tbody tr" );            
            var cells = $(rows[0]).children( "td" );
            expect( $(cells[2]).attr( "title" ) ).toBe( "Any" );
            expect( $(cells[3]).attr( "title" ) ).toBe( "min of 0.5" );
            expect( $(cells[5]).attr( "title" ) ).toBe( "max of 0" );
            expect( $(cells[5]).hasClass( "coverageGoalFailed" )).toBe( true );
            
            var c = $(rows[1]).children( "td" );
            expect( $(c[2]).attr( "title" ) ).toBe( "max of 6 from rulez" );
            expect( $(c[2]).hasClass( "coverageGoalFailed" )).toBe( false );
            expect( $(c[3]).attr( "title" ) ).toBe( "min of 0.8 from rulez" );
            expect( $(c[3]).hasClass( "coverageGoalFailed" )).toBe( true );

        } );
    } );
} );
