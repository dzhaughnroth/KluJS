/*global define:false, describe:false, it:false, expect:false, runs:false, waitsFor:false */
define( [ "lint/LintView", "lint/LintModel", "lint/LintCollection", "lint/LintCollectionSummaryView", "jquery" ], function( LintView, LintModel, LintCollection, LintCollectionSummaryView, $ ) {

    describe( "LintCollectionSummaryView", function() {
        var model = new LintCollection( );
        var view = new LintCollectionSummaryView( { model:model } )
            .render();
        $("body").append( view.$el );
        var check = function( issues, issueFiles, count, clazz, filtered ) {
            var text = view.$el.children(".summary").text();

            expect( text ).toMatch( new RegExp( "^JSLint: " + issues + " issue\\(s\\) in "
                                                + issueFiles + " files out of " 
                                                + count ) );
            if ( filtered && filtered.length > 0 ) {
                var filterSpans = view.$el.find( ".summary span" );
                var filterSpan = $(filterSpans[1]);              
                expect( filterSpan.text() ).toMatch( "(" + filtered.length + " filtered)" );
                expect( filterSpan.attr("title") ).toMatch( filtered[0] );
            }
            if( clazz ) {
                expect( view.$el.hasClass( "running" )).toBe( clazz === "running" );
                expect( view.$el.hasClass( "passed" )).toBe( clazz === "passed" );
                expect( view.$el.hasClass( "failed" )).toBe( clazz === "failed" );
            }

        };
        it( "Is a div with a certain class", function() {
            expect( view.$el.is( "div" )) .toBe( true );
            expect( view.$el.hasClass( "lintCollectionBanner" ) ).toBe( true );
            expect( view.model ).toBe( model );
            check( 0, 0, 0, "passed" );
        } );
        it( "Adds LintViews for each LintModel", function() {
            model.add( new LintModel( { src: "src/test/javascript/lint/LintCollectionViewSpec.js" } ) );
            check( 1, 1, 1, "running" );
            model.add( new LintModel( { src: "src/test/javascript/lint/LintViewSpec.js" } ));
            check( 2, 2, 2, "running" );
            model.add( new LintModel( { src: "src/test/javascript/lint/LintModelSpec.js" } ));
            check( 3, 3, 3, "running" );

            model.addFinderResult( {
                allModules : [ "src/test/javascript/lint/LintFailureSample.js" ],
                filterMap: { lib: [ "found4" ] },
                filtered: ["found4"]
            }  );
            
            check( 4, 4, 4, "running", ["found4"] );
            
        } );
        it( "Updates summary counts when models change", function() {
            runs( function() { 
                model.each( function( lm ) { lm.check(); } );                
            } );
            waitsFor( function( ) {
                return model.finished() === model.length;
            }, 1000 );
            runs( function() {
                var text = view.$el.text();
                expect( text )
                    .toMatch( /JSLint: \d* issue\(s\) in \d files out of 4/ );
                expect( text )
                    .not.toMatch( /JSLint: 0/ );
                // TODO
                // Our test could fail if lint check fails in a certain way.
                // GOTCHA possibly spurious failure; keep lint clean.
                expect( /JSLint: 3 issue\(s\) in 3/.test(text) ).toBeFalsy();
                expect( view.$el.hasClass( "running" ) ).toBe( false );
                expect( view.$el.hasClass( "failed" ) || 
                        view.$el.hasClass( "passed" ) ).toBe( true );
            } );
        } );
    } );
} );
