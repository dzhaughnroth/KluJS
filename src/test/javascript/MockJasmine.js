/*global define:false */
define( [ ], function( ) {

    var MockJasmine = function( jsApiResultsFunction ) {

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
    return MockJasmine;

} );
