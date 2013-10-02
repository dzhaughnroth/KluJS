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

    var noFilter = function() { 
	return true; 
    };
    var failedFilter = function(specResult) { 
	return specResult.failedCount > 0;
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
                // FIXME maybe skips?
                var status = "passed";
                var counts = self.getCounts();
                if ( counts && counts.failedCount > 0 ) {
                    status = "failed";
                }
                this.set("status", status);
            } );
            _.bindAll( this, "getCounts" );
        },
        createSuiteModel : function( suite ) {
            var result = new SuiteModel();
            result.set( "suite", suite );
            this.set("status", "running");
            return result;
        },
	getSpecDetails : function( optionalFilter ) {
	    var filter = optionalFilter || noFilter;
	    var result = {};
	    _.each( this.specMap, function( specModel, id ) {
		var results = specModel.getResults();
		if ( filter( results ) ) {
		    result[id] = results;
		    result[id].title = specModel.fullDescription();
		}
	    } );
	    return result;
	},
	getFailedSpecDetails : function() {
	    return this.getSpecDetails( failedFilter );
	},
        getCounts : function() {
            var result;
            if ( this.get("done") ) {
                result = { failedCount: 0, passedCount: 0, totalCount:0, skippedCount:0 };
                $.each( this.specMap, function(id, specModel) {
                    ++result.totalCount;
//                   var spec = specModel.get("spec");
//                   var results = spec.results();
		    var results = specModel.getResults();
                    if ( results.skipped ) {
                        ++result.skippedCount;
                    }
                    else if ( results.failedCount === 0 ) {
                        ++result.passedCount;
                    }
                    else {
                        ++result.failedCount;
                    }
                } );
            }
            return result;
        }

    } );

    return Model;

} );
