/*globals define:false */

define( [ "./SuiteRunner", "./SuitePage", "./autosuite/AutoSuiteFetcher", "./Config", "jquery" ], function( SuiteRunner, SuitePage, AutoSuiteFetcher, notKlujs, $ ) {

    var SuiteStarter = function( pageFacade, jasmineImpl, mockFetcher ) {
        var self = this;
        this.jasmine = jasmineImpl;
        this.pageFacade = pageFacade;
        this.fetcher = undefined;
        this.suitePage = new SuitePage( self.pageFacade, jasmineImpl );
        this.errorCallback = function( err ) {
            self.suitePage.fail( err );
        };
        this.suiteRunner = new SuiteRunner( self.suitePage.assembly.name, 
                                            this.errorCallback,
                                            self.jasmine );        
        this.start = function() {            
            // has to come first. :(
            self.jasmine.getEnv().reporter.subReporters_.unshift( 
                self.suitePage.view.jasmineView.reporter 
            );
            self.suitePage.buildDom();
            self.fetcher = mockFetcher || new AutoSuiteFetcher( notKlujs );
            self.fetcher.fetch( function() { 
                self.suiteRunner.go();
            }, 
                                self.errorCallback
                              );
        };
    };

    return SuiteStarter;
} );