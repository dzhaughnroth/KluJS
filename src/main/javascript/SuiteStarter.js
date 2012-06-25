/*globals define:false, klujs:false, jasmine:false */
define( [ "./lib/order!./lib/jasmine", "./lib/order!./lib/jasmine-html", "./lib/order!./SuiteRunner", "./lib/order!./SuitePage", "jquery" ], function( j, jh, SuiteRunner, SuitePage, $ ) {

    var page = new SuitePage();
    // has to come first. :(
    jasmine.getEnv().reporter.subReporters_.unshift( page.view.jasmineView.reporter );
    $("body").ready( function() {
        page.buildDom();
    } );
    var sr = new SuiteRunner();
    sr.go();
    
} );
