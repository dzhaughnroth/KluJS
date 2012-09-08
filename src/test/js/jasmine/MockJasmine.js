/*global define:false, describe:false, it:false, expect:false, runs:false, waitsFor:false, waits:false */
define( [ ], function( ) {

    var MockJasmine = function() {
        var id = 0;

        var makeMockSpec = function( mockResults ) {
            return {
                id : ++id,
                description: "spec" + id,
                mockResults : mockResults,
                results : function() {
                    return this.mockResults;
                }
            };
        };
        
        var makeMockSuite = function( specs, suites ) {
            var mySpecs = specs || [];
            var mySuites = suites || [];
            return {
                id : ++id,
                description: "suite" + id,
                mockSuites : mySuites,
                mockSpecs : mySpecs,
                suites : function() { return this.mockSuites; },
                specs : function() { return this.mockSpecs; },
                results : function() { return this.mockResults; }
            };
        };
        
        var makeMockRunner = function( suites ) {
            var mySuites = suites || [];
            return {
                mockSuites : mySuites,
                suites: function() {
                    return this.mockSuites;
                },
                results : function() { return this.mockResults; }
            };
        };

        var Item = function( pass, i ) {
            this.passed = function() { return pass; };
            this.toString = function() { return pass ? "Passed." : "Fail message " + i; };

        };
        
        var makeMockResults = function( total, failed ) {
            var items = [];
            var i;
            for ( i = 0; i < total; i++ ) {
                var item = new Item( i >= failed, i );
                if ( i % 2 !== 0 ) {
                    item.trace = { stack : "Foo\nBar:85:86\n/KluJS/Stuff:10:23\nBaz:9:28" };
                }
                items.push( item );
            }
            return {
                totalCount : total,
                failedCount : failed,
                passedCount : total - failed,
                getItems : function() { return items; }
            };
        };
        
        var simpleSuite = function() {
            return makeMockSuite( [ makeMockSpec(), makeMockSpec() ] );
        };
        
        var standardSuite = function(  ) {
            var result = makeMockSuite( [makeMockSpec()], [simpleSuite()] );
            // The following is not be faithful to the API, but sufficient for now.
            // The API returns the jasmine.Suite object
            result.mockSuites[0].parentSuite = result.id;
            return result;
        };
        
        var standardRunner = function() {
            var ss = standardSuite();
            return makeMockRunner( [ss, ss.mockSuites[0] ] );
        };

        var MockImpl = function( jsApiResultsFunction ) {
            
            this.reporters = [];
            this.executed = false;
            this.Reporter = function() { };
            this.JsApiReporter = function() {
                this.results = jsApiResultsFunction;
            };
            this.HtmlReporter = function() {
                
            };
            
            var self = this;
            var env = {
                addReporter : function( x ) {                
                self.reporters.push( x );
                },
                reporter : {
                    subReporters_ : []
                },
                execute : function() {
                    self.executed = true;
                }
            };
            self.getEnv = function() {
                return env;
            };
        };

        
        this.standardRunner = standardRunner;
        this.standardSuite = standardSuite;
        this.simpleSuite = simpleSuite;
        this.makeMockSpec = makeMockSpec;
        this.makeMockResults = makeMockResults;
        this.mockImpl = new MockImpl();

    };
    

    return MockJasmine;
} );
