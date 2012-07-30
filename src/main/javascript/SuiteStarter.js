/*globals define:false, jasmine:false */

define( [ "./SuiteRunner", "./SuitePage", "./autosuite/AutoSuiteFetcher", "jquery" ], function( SuiteRunner, SuitePage, AutoSuiteFetcher, $ ) {

    // mockBody needs a ready method that takes a callback.
    var SuiteStarter = function( pageFacade, mockJasmine, mockFetcher ) {
        var self = this;
        this.jasmine = mockJasmine;
        this.pageFacade = pageFacade;
        this.suiteRunner = undefined;
        this.fetcher = undefined;
        this.suitePage = new SuitePage( self.pageFacade );
        this.suiteRunner = new SuiteRunner( self.suitePage.assembly.name, 
                                            function( err ) { self.suitePage.fail( err ); },
//                                            self.pageFacade.ready,
                                            self.jasmine );
        
        this.start = function() {            
            // has to come first. :(
            self.jasmine.getEnv().reporter.subReporters_.unshift( 
                self.suitePage.view.jasmineView.reporter 
            );
            self.pageFacade.ready( function() {
                self.suitePage.buildDom();
            } );
            self.fetcher = mockFetcher || new AutoSuiteFetcher();
            self.fetcher.fetch( function() { 
                self.suiteRunner.go();
            }, 
                                function( err ) { 
                                    self.suitePage.fail( err );
                                } 
                              );
        };
    };

    return SuiteStarter;
} );