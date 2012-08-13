/*global define:false, describe:false, it:false, expect:false, runs:false, waitsFor:false */
define( [ "lint/LintView", "lint/LintModel", "lint/LintCollection", "lint/LintCollectionView", "notUnderscore", "notJQuery" ], function( LintView, LintModel, LintCollection, LintCollectionView, _, $ ) {

    describe( "LintCollectionView", function() {
        var model = new LintCollection( );
        model.add( new LintModel( { src: "src/test/js/lint/LintCollectionViewSpec.js" } ) );
        var view = new LintCollectionView( { model:model } ).render();
        $("body").append( view.$el );
        it( "Renders as a div with certain class name", function() {
            expect( model.modelsBySrc ).toEqual( {} );
            expect( view.$el.hasClass( "lintCollectionView" ) ).toBe( true );
            expect( view.$el.is( "div" ) ).toBe( true );
        } );
        it( "Has toggle for global variable view", function() {
            expect( view.$el.find(".lintGlobalVariableReport").hasClass( "hidden" ) ).toBe( true );
            view.showGlobalsModel.set("checked", true );
            expect( view.$el.find(".lintGlobalVariableReport").hasClass( "hidden" ) ).toBe( false );
            view.showGlobalsModel.set("checked", false );
            expect( view.$el.find(".lintGlobalVariableReport").hasClass( "hidden" ) ).toBe( true );
        } );
        it( "Can handle an empty state", function() {
            var view2 = new LintCollectionView( { model: new LintCollection() } ).render();
            expect( view2.$el.find( "div.lintItem" ).length ).toBe( 0 );            
            expect( view2.$el.children( "div" ).length ).toBe( 2 );            
            expect( view2.$el.find( "div.lintGlobalVariableReport" ).length ).toBe( 1 );            
        } );
        it( "Can initializes to non-empty initial state", function() {
            expect( view.model ).toBe( model );
            expect( view.$el.find( "div.lintItem" ).length ).toBe( 1 );
        } );
        it( "Adds LintViews for each LintModel", function() {
            model.add( new LintModel( { src: "src/test/js/lint/LintViewSpec.js" } ));
            expect( view.$el.find( ".lintCollectionBanner" ).text() )
                .toMatch( /JSLint: 2 issue\(s\) in 2 files out of 2/ );
            expect( view.$el.find( ".lintCollectionBanner" ).text() )
                .not.toMatch( /iltered/ );
            model.at(0).set("lintData", { globals: ["foo", "bar"] });
            expect( view.$el.find( "div.lintGlobalVariableReport" ).find("li").length ).toBe( 2 );            

        } );
        it( "Adds LintFinder results", function() {
            var mockFound = {
                allModules : [ "src/test/js/lint/LintModelSpec.js" ],
                filtered : [ "glug", "foo", "bar", "baz" ],
                filterMap : {
                    custom : ["glug"],
                    lib : ["foo", "bar"],
                    "default" : ["baz"]
                }
            };
            model.addFinderResult( mockFound );
            expect( view.$el.find( "div.lintItem" ).length ).toBe( 3 );
            var banner = view.$el.find( ".lintCollectionBanner" );
            expect( banner.text() )
                .toMatch( /JSLint: 3 issue\(s\) in 3 files out of 3/ );
            expect( banner.text() )
                .toMatch( /\(4 filtered\)/ );
            expect( banner.hasClass( "hidden" ) ).toBe( false );
            var tooltip = banner.children(".summary").find("span:last").attr( "title" );
            $.each( mockFound.filtered, function( i, x ) {
                expect( tooltip.indexOf( x ) > 0 ).toBe( true );
            } );
        } );
        it( "Updates summary counts when models change", function() {
            var initialText;
            runs( function() { 
                initialText = view.$el.find(".lintCollectionBanner").text();
                model.each( function( lm ) { lm.check(); } );                
            } );
            waitsFor( function() {
                var workingVals = model.map( function( lm ) {
                    return lm.get("done");
                } );
                return _.reduce( workingVals, 
                                 function( a, memo ) {return a && memo;},
                                 true );               
            }, "Too long to compute lint", 2000 );
            runs( function() {
                var banner = view.$el.find( ".lintCollectionBanner" );

                expect( banner.hasClass( "hidden" ) ).toBe( false );
                var text = view.$el.find( ".lintCollectionBanner" ).text();
                expect( text === initialText ).toBe( false );
                // GOTCHA at least one of our test things must have no lint error
                var passed = view.$el.find( ".lintItem.passed" );
                expect( passed.length > 0 ).toBe( true );
                _.each( passed, function(x) {
                    expect( $(x).hasClass( "hidden" )).toBe( true );
                } );
                view.showHideModel.set( "checked", true );
                _.each( passed, function(x) {
                    expect( $(x).hasClass( "hidden" )).toBe( false );
                } );
                view.showHideModel.set( "checked", false );
                _.each( passed, function(x) {
                    expect( $(x).hasClass( "hidden" )).toBe( true );
                } );

            } );
        } );
    } );
} );
