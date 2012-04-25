/*globals define:false, jasmine:false, window:false */
define( [ "jquery",
          "./lintFinder",
          "./lintJob", "./lintDivView",           
          "./lib/jasmine" ], 
        function( $, finder, lintJob, lintView, gooobly ) {
            var jasLint = new jasmine.Reporter();
            var tryPosting = true;//false;
            var hasParent = function() {
                return window && window.parent && window.parent.postMessage 
                    && window.parent !== window; 
            };
            
            var postToParent = function( found ) {
                if ( tryPosting && hasParent() ) {
                    var msg = { 
                        messageType : "jslintb",
                        message: { found:found }
                    };
                    window.parent.postMessage( msg, window.location );
                    return true;
                }
                else {
                    return false;
                }       
            };

            jasLint.jobFactory = new lintJob.LintJobFactory();
            jasLint.lintResults = jasLint.jobFactory.lintJobs;
            jasLint.found = undefined;
            jasLint.reportRunnerResults = function( ) {
                var found = finder.find();
                jasLint.found = found;
                if ( !postToParent( found )) {
                    var lintResults = jasLint.lintResults;
                    jasLint.lintJobs = lintResults;
                    var factoryView = new lintView.LintJobFactoryDivView( jasLint.jobFactory, found );
                    factoryView.containingDiv.attr( "id", "jslintContainer" )
                        .appendTo( $("body" ) );
                    $.each( found.allModules, function( i, src ) {
                        jasLint.jobFactory.create( i, src );
                    } );
                    jasLint.jobFactory.runAll();
                }
            };
            return jasLint;
        } );
