/*globals define:false, klujsAssembly:true */
define( [ "./SuiteAssembly", "./SuiteView", "./Config", "jquery", "require"], function( SuiteAssembly, SuiteView, notKlujs, $, req ) {

    var linkToCss = function( name ) {
        return $("<link />")
            .attr( "rel", "stylesheet" )
            .attr( "type", "text/css" )
            .attr( "href", req.toUrl( "./lib/" + name ) );
    };

    var SuitePage = function( head, body, mockGlobal ) {       
        var self = this;
        this.head = head || $("head");
        this.body = body || $("body");
        this.assembly = new SuiteAssembly();
        if ( mockGlobal ) {
            mockGlobal.klujsAssembly = this.assembly;
        }
        else {
            klujsAssembly = this.assembly;
        }
        this.view = new SuiteView( { model:self.assembly } ).render();
        this.buildDom = function() {
            self.head.append( linkToCss( "jasmine.css" ) )
                .append( linkToCss( "data_table.css" ) )
                .append( linkToCss( "klujs.css" ) );

            self.body.append( self.view.$el );
        };
        this.fail = function(err) {
            var failDiv = $("<div />")
                    .addClass("klujsFailureDiv")
                    .prependTo( this.body );
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
