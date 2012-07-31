/*globals define:false */

define( [ "./SuiteRunner", "./SuitePage", "./autosuite/AutoSuiteFetcher", "jquery" ], function( SuiteRunner, SuitePage, AutoSuiteFetcher, $ ) {

    // mockBody needs a ready method that takes a callback.
    var SuiteStarter = function( pageFacade, jasmineImpl, mockFetcher, mockGlobal ) {
        var self = this;
        this.jasmine = jasmineImpl;
        this.pageFacade = pageFacade;
        this.fetcher = undefined;
        this.suitePage = new SuitePage( self.pageFacade, mockGlobal, jasmineImpl );
        this.errorCallback = function( err ) {
            self.suitePage.fail( err );
        };
        this.suiteRunner = new SuiteRunner( self.suitePage.assembly.name, 
                                            this.errorCallback,
                                            //                                            self.pageFacade.ready,
                                            self.jasmine );
        
        this.start = function() {            
            // has to come first. :(
            self.jasmine.getEnv().reporter.subReporters_.unshift( 
                self.suitePage.view.jasmineView.reporter 
            );
//            self.pageFacade.ready( function() {
                self.suitePage.buildDom();
//           } );
            self.fetcher = mockFetcher || new AutoSuiteFetcher();
            self.fetcher.fetch( function() { 
                self.suiteRunner.go();
            }, 
                                self.errorCallback
                              );
        };
    };

    return SuiteStarter;
} );