/*global define:false, describe:false, it:false, expect:false */
define( [ "JasmineDivReporter", "jquery"], function( JasmineDivReporter, $ ) {
    var mockResults = [ {result:"passed"}, {result:"failed"}, {result:"passed"}];
    var reporter;
    var mockJasmine = {
        addReporter : function() { },
        getEnv : function() {
            return this;
        },
        Reporter : function() {
            reporter = this;
        },
        JsApiReporter : function() {
            this.results = function() {
                return mockResults;
            };
        },
        HtmlReporter : function(x) {
            this.foo = "foo";
            this.pseudoDoc = x;
        }
    };
    var mockJasmineModel = {
        status : "running",
        xresult : "passed",
        result : {},
        get: function( prop ) {
            return this[prop];
        },
        on : function( type, callback ) {
            this.callback = callback;
        },
        computeResult : function() {
            var failed = 0;
            if ( this.xresult === "failed" ) {
                failed = 1;
            }          
            this.result =  { 
                count : 2,
                failed : failed
            };
        }
    };
    describe( "JasmineDivReporter", function() {
        var mockedTopic = new JasmineDivReporter( mockJasmineModel, mockJasmine.HtmlReporter );
        var topic = new JasmineDivReporter( mockJasmineModel );
        it ( "Has a div and an HtmlReporter", function() {
            expect( mockedTopic.$el ).toBeDefined();
            expect( mockedTopic.reporter.foo).toBe( "foo" );
            expect( topic.$el ).toBeDefined();
            expect( topic.reporter.reportRunnerResults ).toBeDefined();
        } );
        it( "Applies body/appendChild calls to its div", function() {
            expect( mockedTopic.$el.children("div.jasmine_reporter").length ).toBe( 0 );
            var stuff = $( "<div />" ).addClass( "jasmine_reporter" )
                    .append( $( "<div />", { text: "Alert" } ).addClass( "alert" ))
                    .append( $( "<div />", { text: "NotAlert" } ).addClass( "notalert" ));
            mockedTopic.reporter.pseudoDoc.body.appendChild( stuff );
            expect( mockedTopic.$el.children("div.jasmine_reporter").length ).toBe( 1 );
        } );
        it( "Redraws itself on status change", function() {
            topic.$el.appendTo( $("body") );             
            // Mock what jasmineHtmlReporter does to the dom.
            var stuff = $( "<div />" ).addClass( "jasmine_reporter" )
                    .append( $( "<div />", { text: "Alert" } )
                             .addClass( "alert" ) 
                             .append( $("<span />", {text:"foo"} )
                                      .addClass( "bar" )
                                      .addClass( "passingAlert" ) 
                                    )
                           )
                    .append( $( "<div />", { text: "NotAlert" } ).addClass( "notalert" ));
            topic.$el.append( stuff );
            var repDiv = $(topic.$el.children( ".jasmine_reporter" )[0]);
            // Check set up.
            expect( repDiv.children( "*" ).length).toBe( 2 );
            expect( topic.$el.find( ".alert" ).length ).toBe( 1 );
           
            mockJasmineModel.status = "done";
            mockJasmineModel.callback( mockJasmineModel, "done" );

            expect( repDiv.hasClass( "minimized" ) ).toBe( true );

            var button = repDiv.find( ".showPassing" );
            expect( button.length ).toBe( 1 );
            button.click();
            expect( repDiv.hasClass( "minimized" )) .toBe( false );
            button.click();
            expect( repDiv.hasClass( "minimized" )) .toBe( true );

            repDiv.find( ".bar" ).removeClass( "passingAlert" ).addClass("failingAlert");
            repDiv.find( ".showPassing" ).remove();

            mockJasmineModel.xresult = "failed";
            mockJasmineModel.status = "done";
            mockJasmineModel.computeResult();
            mockJasmineModel.callback( mockJasmineModel, "done" );
            expect( repDiv.hasClass( "minimized" )) .toBe( false );

//            console.log( $$_l.runLines["/src/main/javascript/JasmineDivReporter.js"] );
 
        } );

    } );
} );
