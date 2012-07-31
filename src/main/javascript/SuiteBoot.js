/*globals define:false, jasmine:false, klujsAssembly:true */

define( [ "./lib/order!./lib/jasmine", "./lib/order!./lib/jasmine-html", "./lib/order!./SuiteStarter", "./lib/order!./HtmlPageFacade" ], function( j, jh, SuiteStarter, HtmlPageFacade) {
    
    var ss = new SuiteStarter( new HtmlPageFacade(), jasmine );
    klujsAssembly = ss.suitePage.assembly;
    ss.start();
} );
