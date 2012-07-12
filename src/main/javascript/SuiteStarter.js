/*globals define:false, klujs:false, jasmine:false */
define( [ "./lib/order!./lib/jasmine", "./lib/order!./lib/jasmine-html", "./lib/order!./SuiteRunner", "./lib/order!./SuitePage", "./lib/order!./autosuite/AutoSuiteFetcher", "jquery" ], function( j, jh, SuiteRunner, SuitePage, Fetcher, $ ) {

    var page = new SuitePage();
    // has to come first. :(
    jasmine.getEnv().reporter.subReporters_.unshift( page.view.jasmineView.reporter );
    $("body").ready( function() {
        page.buildDom();
    } );
    var fetcher = new Fetcher();
    fetcher.fetch( function() { var sr = new SuiteRunner();
                                sr.go();
                              }, 
                   function() { console.log( "Error getting autosuite" ); 
                              } 
                 );
    
} );
