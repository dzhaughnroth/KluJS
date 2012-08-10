/*global define:false, window:false, console:false */
define( [ "./MultiStarter", "../notJQuery"], function( MultiStarter, $ ) {

    $("body").ready( function() {
        var starter = new MultiStarter( $("head"), $("body"), window );
        klujsPage = starter.model;
        starter.start();
    } );

} );
