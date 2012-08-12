/*global define:false, describe:false, it:false, expect:false, runs:false, waitsFor:false */
define( [ "lint/LintView", "lint/LintModel" ], function( LintView, LintModel ) {
    var goodScript = "/*global goo:true*/\ngoo = 3;\n";

    var decentScript = [ "myglobal = 13;", 
                         "var cute = 'cute';",
                         "for( var i = 0; i < 13; i++ ) {",
                         "  cute += '.';",
                         "}" ]
            .join( "\n" );
    var unusedScript = [ "var x = function() {",
                "  var q = 31;",
                "  return 12; };" ].join("\n");


    describe( "LintView", function() {
        var model = new LintModel( { src:"voot" } );
        var view = new LintView( { model:model } );
        it( "Initializes to unfinished state", function() {
            expect( view.model ).toBe( model );
            expect( view.template ).toBeDefined();
            view.render();
            expect( view.$el.children( ".lintItem" ).length).toBe( 0 );
            expect( view.$el.hasClass( "running" ) ).toBe(true);
            expect( view.$el.hasClass( "passed" ) ).toBe(false);
            expect( view.$el.hasClass( "failed" ) ).toBe(false);
        } );
        it( "Renders as passed if there are no lint issues", function() {
            model.process( goodScript );
            expect( view.$el.text() ).toMatch( /voot: 0 issue\(s\)/ );
            expect( view.$el.hasClass( "running" ) ).toBe(false);
            expect( view.$el.hasClass( "passed" ) ).toBe(true);
            expect( view.$el.hasClass( "failed" ) ).toBe(false);
        } );
        it( "Renders as failed if there are lint issues", function() {
            model.process( decentScript );
            expect( view.$el.text() ).toMatch( /voot: 4 issue\(s\)/ );
            expect( view.$el.hasClass( "running" ) ).toBe(false);
            expect( view.$el.hasClass( "passed" ) ).toBe(false);
            expect( view.$el.hasClass( "failed" ) ).toBe(true);
            expect( view.$el.children( ".lintDetail" ).length ).toBe( model.issueCount() );
            expect( view.$el.children( ".hidden" ).length ).toBe( model.issueCount() );
            view.showDetail();
            expect( view.$el.children( ".hidden" ).length ).toBe( 0 );
            view.toggleHidden();
            expect( view.$el.children( ".hidden" ).length ).toBe( model.issueCount() );
            model.process( unusedScript );
            expect( view.$el.text() ).toMatch( /voot: 1 issue\(s\)/ );
            expect( view.$el.children( ".lintDetail" ).text() ).toMatch( /Unused: q/ );

        } );
        it( "Renders as failed on error", function() {
            model.process();
            expect( view.$el.hasClass( "running" ) ).toBe(false);
            expect( view.$el.hasClass( "passed" ) ).toBe(false);
            expect( view.$el.hasClass( "failed" ) ).toBe(true);
        } );
        it( "Can trigger reload", function() {
            var myModel = new LintModel( {src:"src/test/js/lint/LintViewSpec.js"} );
            var myView = new LintView( { model:myModel } );
            runs( function() {
                myView.reload();
                expect( myModel.get( "done" ) ).toBe( false );
            } );
            waitsFor( function() { return myModel.get("done"); },
                     500 );
            runs( function() {
                expect( myModel.get( "done" )).toBe( true );
            } );
            
        } );
    } );
} );
