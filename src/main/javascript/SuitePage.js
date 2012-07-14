/*globals define:false, klujsAssembly:true */
define( [ "./SuiteAssembly", "./SuiteView", "jquery", "require"], function( SuiteAssembly, SuiteView, $, req ) {

    var linkToCss = function( name ) {
        return $("<link />")
            .attr( "rel", "stylesheet" )
            .attr( "type", "text/css" )
            .attr( "href", req.toUrl( "./lib/" + name ) );
    };

    var Runner = function( head, body, mockGlobal ) {       
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
                .append( linkToCss( "klujs.css" ) )
                .append( linkToCss( "data_table.css" ) );

//            self.body.append( $("<h1 />", { text: "KluJS" } ) );
            self.body.append( self.view.$el );
//jasmineView.$el )
//                .append( self.view.lintView.$el )
//                .append( self.view.coverageView.$el );
        };
    };

    return Runner;
} );
