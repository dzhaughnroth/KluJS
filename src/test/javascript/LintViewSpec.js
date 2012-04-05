/*globals define:false, describe:false, it:false, expect:false, JSLINT:false */

define( ["KluJS/lintDivView", "KluJS/lintJob", "KluJS/proxyLintRunner", "jquery"], 

        function( mod, jobMod, LintRunner, $ ) {

            var testingDiv = $( "<div />", { id: "testDiv" } )
                    .appendTo( "body" );
            testingDiv.css( "display", "none" );
            describe( "LintDivView", function() {
                describe( "JobFactoryView", function() {                    
                    var jobFactory = new jobMod.LintJobFactory( new LintRunner( true ));
                    var factoryView = new mod.LintJobFactoryDivView( jobFactory );
                    var myDiv = factoryView.containingDiv;
                    myDiv.appendTo( testingDiv );
                    var childDiv = function( i ) {
                        // The +1 is because of the headline.
                        return $( $(myDiv.children()[i+1] ));
                    };

                    it ( "Should create views", function() {
                        jobFactory.create( 1, "Stuffupliness/hihi/h" );
                        jobFactory.create( 2, "nowthere/theretherethere" );
                        var view1 = factoryView.divViews[1];
                        var view2 = factoryView.divViews[2];
                        // We simplify this test; see below tests of renderDetailDiv
                        view2.renderDetailDiv = function( lintJob, targetDiv ) {
                            targetDiv.text( "Hi ho" );
                        };

                        expect( childDiv(0).text()).toMatch( /hihi\/h$/ );
                        expect( childDiv(1).text().match( /\.\.\.theretherethere/ )).toBeTruthy();
                        var j1 = jobFactory.lintJobs[1];
                        // mocking
                        j1.error = true;
                        j1.message = "foo";
                        view1.update( j1 );//{ src:"hi/hi", error:true, message:"foo" } );
                        expect( childDiv(0).text().match( /hi.*failed.*foo/ )).toBeTruthy();
                        expect( childDiv(0).hasClass( "jslintPassed" ) ).toBe( false );
                        expect( childDiv(0).hasClass( "jslintFailed" ) ).toBe( true );  
                        var j2 = jobFactory.lintJobs[2];
                        // mocking
                        j2.error = false;
                        j2.message = "goo";
                        j2.issueCount = function() { return 0; };
                        view2.update( j2 );

                        expect( childDiv(1).hasClass( "jslintPassed" ) ).toBe( true );
                        expect( childDiv(1).hasClass( "jslintFailed" ) ).toBe( false );
                        var subspan = $(childDiv(1).children("span")[0] );
                        var reloadSpan = $(childDiv(1).children("button")[0] );
                        expect( reloadSpan.text() ).toBe( "Reload" );
                        reloadSpan.click();
                        expect( reloadSpan.text() ).toBe( "Reloading" );
                        // TODO
//                        console.log( "goo" );

                        var detailDiv = $(childDiv(1).children("div")[0] );
                        expect( subspan.text()).toMatch( /\.\.\.there.*No issues/ ); 
                        expect( detailDiv.text()).toEqual( "Hi ho" );
                        // click span to toggle detail display
                        expect( detailDiv.hasClass("hidden" )).toBe( true );     
                        subspan.click();
                        expect( detailDiv.hasClass("hidden" )).toBe( false );     
                        subspan.click();
                        expect( detailDiv.hasClass("hidden" )).toBe( true );     
                    } );
                    describe( "Detail renderer", function() {
                        it( "Should list jslint issues", function() {
                            var div = $("<div />", {id:"detailTestDiv"})
                                    .appendTo( testingDiv );
                            jobFactory.create( 2, "nowthere/theretherethere" );
                            var view = factoryView.divViews[2];
                            var script = [ "/*global boo:false*/",
                                           "//bar = foo.start;",
                                           "function boo() {",
                                           "  var baz,",
                                           "      i = 0;",
                                           "  for( i = 0; i < 10; i++ ) {",
                                           "    bar += i;",
                                           "    foo = i;",
                                           "  }",
                                           "}"].join("\n");
                            JSLINT( script, {} );
                            var data = JSLINT.data();
                            view.renderDetailDiv( data, div );
                            var chillen = div.children( "p" );
                            expect( chillen.length ).toBe( 3 );
                            var glob = $(chillen[0]);
                            expect( glob.text() ).toMatch( /globals/ );
                            var globspan1 = $(glob.children("span" )[0]);
                            expect( globspan1.text() ).toMatch("bar");
                            expect( globspan1.attr("title" )).toMatch( /line 7/ );
                            var globspan2 = $(glob.children("span" )[1]);
                            expect( globspan2.text() ).toMatch("foo");
                            expect( globspan2.attr("title" )).toMatch( /line 8/ );
                            var unused = $(chillen[1]);
                            var unusedSpan = $(unused.children("span")[0]);
                            expect( unused.text() ).toMatch( /Unused/ );
                            expect( unusedSpan.text() ).toMatch("baz");
                            expect( unusedSpan.attr("title")).toMatch( /line 3/ );
                        } );
                        it( "should handle null cases", function() {
                            var div = $("<div />", {id:"detailTestDiv"})
                                    .appendTo( testingDiv );
                            jobFactory.create( 2, "nowthere/theretherethere" );
                            var view = factoryView.divViews[2];
                            view.renderDetailDiv( undefined, div );
                            expect( $(div.children("p")[0]).text() ).toMatch( /No lint data/ );
                        } );
                        it( "Should handle null paths", function() {
                            jobFactory.create( 2, "nowthere/theretherethere" );
                            var view = factoryView.divViews[2];
                            expect( view.errorText( { message:"foo"} ) ).toMatch( /No path/ );
                        } );
                    } );
                });
            });
        });
