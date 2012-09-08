/*global define:false, jasmine:false */
define( [ "../notJQuery", "../notUnderscore", "../notBackbone", "./SuiteModel"], function( $, _, Backbone, SuiteModel ) {

    var Reporter = function( model ) {
        this.reportRunnerStarting = function(runner) {
            model.set("runner", runner);
        };

        this.reportRunnerResults = function(runner) {
            model.set( "done", true );
        };

        this.reportSuiteResults = function(suite) {
            model.suiteMap[suite.id].set("done", true);
        };

        this.reportSpecStarting = function(spec) {
        };
        
        this.reportSpecResults = function(spec) {
            model.specMap[spec.id].set("done", true);            
        };
        
        this.log = function(str) {
        };
    };

    var Model;
    Model = Backbone.Model.extend( {
        // runner
        // done
        initialize : function() {
            var self = this;
            this.suiteModels = {};
            this.suiteMap = {};
            this.specMap = {};
            this.jasmineReporter = new Reporter( this );
            var computeChildren = function() {
                var runner = this.get( "runner" );
                $.each( runner.suites(), function( i, suite ) {
                    if ( !suite.parentSuite ) {
                        var suiteModel = self.createSuiteModel( suite );
                        self.suiteModels[suite.id] = suiteModel;
                        suiteModel.rollupIdMaps( self.suiteMap, self.specMap );
                    }
                } );
                self.set("status", "running");
            };
            this.on( "change:runner", computeChildren );
            this.on( "change:done", function() {
                var runner = this.get("runner");
                var status = "passed";
                if ( runner.results().failedCount > 0 ) {
                    status = "failed";
                }
                this.set("status", status);
            } );
        },
        createSuiteModel : function( suite ) {
            var result = new SuiteModel();
            result.set( "suite", suite );
            this.set("status", "running");
            return result;
        }

    } );

    return Model;

} );