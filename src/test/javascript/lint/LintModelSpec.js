/*global define:false, describe:false, it:false, expect:false, runs:false, waitsFor:false */
define( [ "lint/LintModel" ], function( LintModel ) {
    var goodScript = "/*global goo:true*/\ngoo = 3;\n";

    var decentScript = [ "myglobal = 13;", 
                         "var cute = 'cute';",
                         "for( var i = 0; i < 13; i++ ) {",
                         "  cute += '.';",
                         "}" ]
            .join( "\n" );

    var badScript = 
            [ "function() { ",
              "  if ( false ) {",
              "    var q = 31;",
              "    return 12;",
              "  }",
              "  return 9;",
              "}"].join("\n")
        + "for( var i = 0; i < 13; i++ {\n  cute += '.';\n}\n";

    describe( "LintModel", function() {
        var changes = [];
        var model = new LintModel( { src:"voot" } );
        model.on( "change", function( ) {
            changes.push( arguments );
        } );
        it( "Initializes to neutral state", function() {
            expect( model.get("src") ).toBe( "voot" );
            expect( model.get("done") ).toBe( false );
            expect( function() { model.issueCount(); } ).toThrow( "No JSLINT data" );
        } );
        describe( "Processes javascript", function() {
            it( "Updates data with good scripts", function() {
                model.process( decentScript );
                expect( changes.length ).toBe( 1 );
                expect( model.get( "done" ) ).toBe( true );
                expect( model.get( "error" ) ).toBe( false );
                expect( model.get( "lintData" ) ).toBeDefined();
                expect( model.issueCount() ).toBe( 4 );
                model.process( goodScript );
                expect( model.issueCount() ).toBe( 0 );
            } );
            it( "Processes bad scripts as well as it can", function() {
                model.process( badScript );
                expect( model.get( "done" ) ).toBe( true );
                expect( model.get( "error" ) ).toBe( false );
                expect( model.get( "lintData" ) ).toBeDefined();
                expect( model.issueCount() > 2).toBe( true );
            } );

            it( "Deals with failure", function() {
                model.process( null );
                expect( model.get( "done" ) ).toBe( true );
                expect( model.get( "error" ) ).toBe( true );
                expect( model.get( "message" ) ).toMatch( "JSLint failed" );                
            } );
        } );
        describe( "Fetches javascript", function() {
            it( "Gets and processes javascript asynchrounously", function() {
                var autoModel = new LintModel( { 
                    src:"src/test/javascript/lint/LintModelSpec.js" 
                } );
                runs( function() {
                    autoModel.check();                   
                    expect( autoModel.get( "done" ) ).toBe( false );
                } );
                waitsFor( function( ) {
                    return autoModel.get( "done");
                }, "Too long to check lint", 1000 );
                runs( function() {
                    expect ( autoModel.get( "done" ) ).toBe( true );
                    expect ( autoModel.get( "error" ) ).toBe( false );
                } );
            } );
            it ( "Reports http failures", function() {
                var badModel = new LintModel( { 
                    src:"src/test/javascript/doesnotexist.jsnon" 
                } );
                runs( function() { 
                    badModel.check();
                    expect( badModel.get( "done" ) ).toBe( false );
                } );
                waitsFor( function( ) { 
                    return badModel.get( "done");
                }, "Too long to complete lint", 1000 );               
                runs( function() {
                    expect ( badModel.get( "done" ) ).toBe( true );
                    expect ( badModel.get( "error" ) ).toBe( true );
                    expect ( badModel.get( "message" ) ).toMatch( /^HTTP failed:/ );
                } );
            } );
        } );
    } );
} );

