/*globals define:false, klujsAssembly:true */
define( [ "./suite/SuiteAssembly", "./suite/SuiteView", "./Config", "jquery", "require"], function( SuiteAssembly, SuiteView, notKlujs, $, req ) {

    var linkToCss = function( name ) {
        return $("<link />")
            .attr( "rel", "stylesheet" )
            .attr( "type", "text/css" )
            .attr( "href", req.toUrl( "./lib/" + name ) );
    };

    var SuitePage = function( pageFacade, jasmineImpl ) {       
        var self = this;
        this.pageFacade = pageFacade;
        this.assembly = new SuiteAssembly( undefined, jasmineImpl );
        this.view = new SuiteView( { model:self.assembly } ).render();
        this.buildDom = function() {
            self.pageFacade.head.append( linkToCss( "jasmine.css" ) )
                .append( linkToCss( "data_table.css" ) )
                .append( linkToCss( "klujs.css" ) );

            self.pageFacade.body.append( self.view.$el );
        };
        this.fail = function(err) {
            var failDiv = $("<div />")
                    .addClass("klujsFailureDiv")
                    .prependTo( this.pageFacade.body );
            $("<h1 />", {text:"Error: KluJS did not work"} )
                .addClass( "klujsFailureHeadline" )
                .appendTo( failDiv );

            var text = JSON.stringify( err );
            $("<pre />", {text: text} )
                .addClass( "klujsFailureText" )
                .appendTo( failDiv );
        };
    };

    return SuitePage;
} );
