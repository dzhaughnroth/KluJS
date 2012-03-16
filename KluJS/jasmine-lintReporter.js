/*globals define:false, jasmine:false */
define( [ "jquery",
          "./lintFinder",
          "./lintJob", "./lintDivView",           
          "./lib/jasmine" ], 
        function( $, finder, lintJob, lintView, gooobly ) {
            var jasLint = new jasmine.Reporter();

            jasLint.jobFactory = new lintJob.LintJobFactory();
            jasLint.lintResults = jasLint.jobFactory.lintJobs;
            jasLint.found = undefined;
            jasLint.reportRunnerResults = function( x ) {
                var found = finder.find();
                jasLint.found = found;
                var lintResults = jasLint.lintResults;
                jasLint.lintJobs = lintResults;
                var factoryView = new lintView.LintJobFactoryDivView( jasLint.jobFactory, found );
                factoryView.containingDiv.attr( "id", "jslintContainer" )
                    .appendTo( $("body" ) );
                $.each( found.allModules, function( i, src ) {
                    jasLint.jobFactory.create( i, src );
                } );
                jasLint.jobFactory.runAll();
            };

            return jasLint;
        } );
