/*globals define:false, requirejs:false, console:false */

define( [ "./SuiteRunner", "./SuitePage", "./autosuite/AutoSuiteFetcher", "./Config", "jquery", "./lib/purl" ], function( SuiteRunner, SuitePage, AutoSuiteFetcher, notKlujs, $, purl ) {

    var SuiteStarter = function( pageFacade, jasmineImpl, mockFetcher, mockRequireJs ) {
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
                                            self.jasmine,
                                            purl() );        
        this.start = function() {            
            // has to come first. :(
            self.jasmine.getEnv().reporter.subReporters_.unshift( 
                self.suitePage.view.jasmineView.reporter 
            );
            self.suitePage.buildDom();
            self.fetcher = mockFetcher || new AutoSuiteFetcher( notKlujs );
            self.fetcher.fetch( function() { 
                try {
                    self.suiteRunner.go();
                }
                catch( ex ) {
                    self.suitePage.fail( { message:"Exception running Specs",
                                           error:ex } );
                    throw ex;
                }
            }, 
                                self.errorCallback
                              );
        };

        var prevErrorHandler = mockRequireJs.onError;
        this.errorHandler = function( err ) {
            console.log( "KluJS suite failing due to RequireJS error" );
            console.log( err );
            self.suitePage.fail( {
                message:"RequireJS caught error: see console.",
                requireJsError:err
            } );
            if ( prevErrorHandler ) {
                prevErrorHandler( err );
            }
        };

        mockRequireJs.onError = this.errorHandler;

    };

    return SuiteStarter;
} );
