/*globals define:false, jasmine:false */

define( [ "./lib/order!./lib/jasmine", "./lib/order!./lib/jasmine-html", "./lib/order!./SuiteStarter" ], function( j, jh, SuiteStarter) {
    
    var ss = new SuiteStarter( jasmine );
    ss.start();
    
} );
