/*globals define:false */
define( [ "jquery", "./jasmine-klujs", "require"], function( $, jg, req ) {

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
                     .append( $("<a />", { onclick: "jasmineGradle.runAllSpecs()",
                                         title: "Reload all"} )
                              .text( "Multi Spec Runner:" ))
                     .append( $("<span />", {id: "subheadline"} )
                              .text( "Loading..." ))
                   )
            .append( $("<div />", {id:"runnerContainer"} )
                     .text( "Loading..." ) );
    };
    
    $.each( klujsConfig.suites, function( i, suite ) {
        jasmineGradle.add( window.location.href + "?suite=" + i, i );
    } );
    if ( klujsConfig.specRunners ) {
        $.each( klujsConfig.specRunners, function( i, runner ) {
            jasmineGradle.add( runner );
        });
    }

    $(document).ready( function() {
        makeTemplate();
        jasmineGradle.buildDivsForSpecRunners();
        jasmineGradle.update();
    } );
} );