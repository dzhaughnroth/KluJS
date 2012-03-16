/*globals define:false */
define( [ "./klujs", "jquery", "require"], function( klujs, $, req ) {

    var linkToCss = function( name ) {
        return $("<link />")
            .attr( "rel", "stylesheet" )
            .attr( "type", "text/css" )
            .attr( "href", req.toUrl( "./lib/" + name ) );
    };

    $("head").append( linkToCss( "jasmine.css" ) )
        .append( linkToCss( "lint.css" ) )
        .append( linkToCss( "data_table.css" )
               );
               
    klujs.pretend();
} );
