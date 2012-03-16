/*globals define:false */
define( [ "jquery", "./jasmine-klujs"], function( $, jg ) {
    require( ["../../../test/javascript/specRunners.js"], function() {
        $(document).ready( function() {
            jasmineGradle.buildDivsForSpecRunners();
            jasmineGradle.update();
        } );
    } );
} );