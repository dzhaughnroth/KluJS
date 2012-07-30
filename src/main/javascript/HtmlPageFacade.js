/*globals define:false */
define( [ "jquery"], function( $ ) {

    var HtmlPageFacade = function( mockHead, mockBody, mockReady ) {
        this.head = mockHead || $( "head" );
        this.body = mockBody || $( "body" );
        this.ready = mockReady || $( "body" ).ready;
    };

    return HtmlPageFacade;
} );
