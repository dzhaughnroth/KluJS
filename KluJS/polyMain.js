/*globals define:false */
define( [ "jquery", "./jasmine-klujs", "require"], function( $, jk, req ) {

    var cssLink = function( name ) {
        return $("<link />", {rel:"stylesheet",
                              type:"text/css",
                              href: req.toUrl( "./lib/" + name ) } );
    };

    var makeTemplate = function() {
        $("head").append( cssLink( "lint.css" ) )
            .append( cssLink( "data_table.css" ) )
            .append( cssLink( "polyRunner.css" ));
        $("body")
            .append( $("<h1 />", {id:"headline"} )
                     .addClass( "running" )
                     .text( "KluJS: " )
                     .append( $("<span />", {id: "subheadline"} )
                              .text( "Loading..." ))
                   )
            .append( $("<div />", {id:"runnerContainer"} )
                     .text( "Loading..." ) );
    };
    
    $.each( klujs.suites, function( i, suite ) {
        jk.add( window.location.href + "?suite=" + i, i );
    } );
    if ( klujs.specRunners ) {
        $.each( klujs.specRunners, function( i, runner ) {
            jk.add( runner );
        });
    }

    $(document).ready( function() {
        makeTemplate();
        jk.buildDivsForSpecRunners();
        jk.update();
    } );
} );