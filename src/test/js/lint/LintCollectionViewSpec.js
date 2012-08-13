/*global define:false, describe:false, it:false, expect:false, runs:false, waitsFor:false */
define( [ "lint/LintView", "lint/LintModel", "lint/LintCollection", "lint/LintCollectionView", "notBackbone", "notUnderscore", "notJQuery" ], function( LintView, LintModel, LintCollection, LintCollectionView, Backbone, _, $ ) {

    describe( "LintCollectionView", function() {
        var failSrc = "src/test/js/lint/LintFailureSample.js.not";
        var passSrc = "src/test/js/lint/LintSuccessSample.js.not";
        var failingA = new LintModel( { src: failSrc } );
        var failingB = new LintModel( { src: failSrc } );
        var passingA = new LintModel( { src: passSrc } );
        var passingB = new LintModel( { src: passSrc } );
        var model = new LintCollection( );
        model.add( passingA );
        model.add( failingA );
        model.add( passingB );
        model.add( failingB );
        var passingModel = new LintCollection();
        passingModel.add( passingA );
//        passingModel.add( passingB );
        var view = new LintCollectionView( { model:model } ).render();
        var passingView = new LintCollectionView( { model:passingModel } ).render();
        var emptyView = new LintCollectionView( { model:new LintCollection() } ).render();

        // $("body").append( $("<div />", { text : "lcv" } ) ).append( view.$el );
        
        it( "Renders as a div with certain class name", function() {
            expect( emptyView.$el.hasClass( "lintCollectionView" ) ).toBe( true );
            expect( emptyView.$el.is( "div" ) ).toBe( true );
        } );
        it( "Holds LintViews for each LintModel in collection", function() {
            expect( emptyView.lintViews ).toEqual( [] );
            expect( view.lintViews.map( function(x) { return x.model.get("src"); } )).toEqual(                 
                [ passSrc, failSrc, passSrc, failSrc ]
            );
            expect( view.$el.find( "div.lintItem" ).length ).toBe( 4 );
        } );
        it( "Can handle an empty state", function() {
            expect( emptyView.$el.find( "div.lintItem" ).length ).toBe( 0 );            
            expect( emptyView.$el.children( "div" ).length ).toBe( 2 );
            expect( emptyView.$el.find( "div.lintGlobalVariableReport" ).length ).toBe( 1 );
        } );
        it( "Updates as items are added", function() {
            var passingBannerText = function() {
                return passingView.$el.find( ".lintCollectionBanner" ).text();
            };
            expect( passingBannerText() ).toMatch( /Loading/ );
            passingA.check(); // start check
            expect( passingBannerText() )
                .toMatch( /1 files out of 1/ );
            passingModel.add( passingB );
            expect( passingView.$el.find( ".lintCollectionBanner" ).text() )
                .toMatch( /2 files out of 2/ );
            expect( passingView.$el.find( ".lintCollectionBanner" ).text() )
                .not.toMatch( /iltered/ );
            passingModel.at(0).set("lintData", { globals: ["foo", "bar"] });
            expect( view.$el.find( "div.lintGlobalVariableReport" ).find("li").length ).toBe( 2 );
        } );
        it( "Adds LintFinder results", function() {
            var mockFound = {
                allModules : [ failSrc ],
                filtered : [ "glug", "foo", "bar", "baz" ],
                filterMap : {
                    custom : ["glug"],
                    lib : ["foo", "bar"],
                    "default" : ["baz"]
                }
            };
            model.addFinderResult( mockFound );
            expect( view.$el.find( "div.lintItem" ).length ).toBe( 5 );
            var banner = view.$el.find( ".lintCollectionBanner" );
            expect( banner.text() )
                .toMatch( /out of 5/ );
            expect( banner.text() )
                .toMatch( /\(4 filtered\)/ );
            expect( banner.hasClass( "hidden" ) ).toBe( false );
            var tooltip = banner.children(".summary").find("span:last").attr( "title" );
            $.each( mockFound.filtered, function( i, x ) {
                expect( tooltip.indexOf( x ) > 0 ).toBe( true );
            } );
        } );
        it( "Updates as models change", function() {
            var initialText;
            runs( function() { 
                initialText = view.$el.find(".lintCollectionBanner").text();
                model.each( function( lm ) { lm.check(); } );                
            } );
            waitsFor( function() {
                return typeof (model.find( function( lm ) { 
                    return ! lm.get("done");
                } )) === "undefined";
            }, "Too long to compute lint", 2000 );
            runs( function() {
                var banner = view.$el.find( ".lintCollectionBanner" );

                expect( banner.hasClass( "hidden" ) ).toBe( false );
                var text = view.$el.find( ".lintCollectionBanner" ).text();
                expect( text === initialText ).toBe( false );
                expect( text ).toMatch( /3 issue.*3 files out of 5/ );
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
        it( "Shows the first failing detail automatically", function() {
            var detailsShown = function() {
                return view.$el.find( ".lintDetail:not(.hidden)" );
            };

            expect( detailsShown().length ).toBe( 1 );
        } );
        it( "Has toggle for global variable view", function() {
            expect( view.$el.find(".lintGlobalVariableReport").hasClass( "hidden" ) ).toBe( true );
            view.showGlobalsModel.set("checked", true );
            expect( view.$el.find(".lintGlobalVariableReport").hasClass( "hidden" ) ).toBe( false );
            view.showGlobalsModel.set("checked", false );
            expect( view.$el.find(".lintGlobalVariableReport").hasClass( "hidden" ) ).toBe( true );
        } );
    } );
} );
