/*globals define:false, requirejs:false, console:false */

define( [ "./SuitePage", "./autosuite/AutoSuiteFetcher", "./Config", "./notJQuery", "./lib/purl", "require", "./jasmine/SpecToText"], function( SuitePage, AutoSuiteFetcher, notKlujs, $, purlPkg, require, SpecToText ) {

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
        this.runSpecs = function( specs ) {
            var self = this;
            require( specs, function() {
                try {
                    jasmineImpl.getEnv().execute();
                }
                catch( x ) {
                    self.suitePage.fail( { message: "Error executing jasmine",
                                           error: x } );
                    if ( self.errorCallback ) {
                        self.errorCallback( x );
                    }
                }
            } );
        };

        this.buildFilter = function( filterParam ) {
            if ( filterParam ) {
                var regex = new RegExp( filterParam );
                var filter = function(x) {                    
                    var result = regex.test( SpecToText.full(x));
                    return result;
                };
                jasmineImpl.getEnv().specFilter = filter;
            }
        };

        this.go = function() {
            var suite = self.purl.param("suite");
            self.buildFilter( self.purl.param("filter"));
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
            this.runSpecs( relSpecs, self.errorCallback );
        };        
        this.start = function() { 
            // has to come first. :(
//            self.jasmine.getEnv().reporter.subReporters_.unshift( 
//                self.suitePage.view.jasmineView.reporter 
//            );
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
