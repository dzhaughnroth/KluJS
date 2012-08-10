/*globals define:false */
define( [ "./notJQuery"], function( $ ) {

    var HtmlPageFacade = function( mockHead, mockBody, mockReady ) {
        this.head = mockHead || $( "head" );
        this.body = mockBody || $( "body" );
        this.ready = mockReady || $( "body" ).ready;
    };

    return HtmlPageFacade;
} );
