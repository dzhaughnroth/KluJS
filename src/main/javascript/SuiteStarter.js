/*globals define:false, requirejs:false, console:false */

define( [ "./SuitePage", "./autosuite/AutoSuiteFetcher", "./Config", "./notJQuery", "./lib/purl" ], function( SuitePage, AutoSuiteFetcher, notKlujs, $, purlPkg ) {

    var SuiteStarter = function( pageFacade, jasmineImpl, mockFetcher, mockRequireJs ) {
        var self = this;
        this.klujsConfig = notKlujs;
        this.purl = purlPkg();
        this.jasmine = jasmineImpl;
        this.pageFacade = pageFacade;
        this.fetcher = undefined;
        this.suitePage = new SuitePage( self.pageFacade, jasmineImpl );
        this.errorCallback = function( err ) {
            self.suitePage.fail( err );
        };
        this.go = function() {
            var suite = self.purl.param("suite");
            self.suitePage.assembly.name.set( "suiteName", suite );
            self.suitePage.assembly.deadCode.set( "exceptions", self.klujsConfig.deadCode() );
            var targets = self.klujsConfig.targetsForSuite( suite );
            if ( targets ) {
                var main = self.klujsConfig.main();
                self.suitePage.assembly.codeList.set( "codeList", targets.map( function(x) { return "/" + main + "/" + x; } ) );
            }
            var relSpecs = [];
            var prefix = self.klujsConfig.test();
            if ( ! self.klujsConfig.specsForSuite( suite ) ) {
                throw( "There is no suite named '" + suite + "' to run");
            }
            $.each( self.klujsConfig.specsForSuite(suite), function( i, spec ) {
                var pathToSpec = prefix + "/" + spec;
                relSpecs.push( pathToSpec );
            });
            self.suitePage.assembly.jasmine.runSpecs( relSpecs, self.errorCallback );
        };        
        this.start = function() { 
            // has to come first. :(
            self.jasmine.getEnv().reporter.subReporters_.unshift( 
                self.suitePage.view.jasmineView.reporter 
            );
            self.suitePage.buildDom();
            self.fetcher = mockFetcher || new AutoSuiteFetcher( notKlujs );
            self.fetcher.fetch( function() { 
                try {
                    self.go();
                }
                catch( ex ) {
                    self.errorCallback( { message:"Exception running Specs",
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
