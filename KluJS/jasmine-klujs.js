/*global jasmineGradle: true, $: false, define:false */
// FIXME jasmineGraldle global.
define( ["jquery", 
         "./childRunner",
         "./lib/purl",
         "./coverageView",
         "./lintJob", "./lintDivView"
        ], 
        function($, crm, purl, coverageView, lintJob, lintView) {
            
            var RunnerTable = function() {
                this.tableEl = $( "<table />" )
                    .append( $( "<thead />" )
                             .append( $( "<tr />", {id:"foo"} )
                                      .append( $("<td />", {text:"SpecRunner" } ))
                                      .append( $("<td />", {text:"Specs" } ))
                                    )
                           );
                var rows = [];
                var RunnerRow = function( specRunner ) {
                    this.rowEl = $("<tr />");
                    var statusCell = $( "<td />", {text:specRunner.status} );
                    this.rowEl.append( $( "<td />" ).append( titleFor( specRunner )));
                    this.rowEl.append( statusCell );
                    specRunner.listeners.push( function( s, cr ) {
                        var extra = s;
                        if ( cr.isDone() ) {
                            if ( cr.isPassed() ) {
                                extra = "All " + cr.results.length + " passed.";
                            }
                            else {
                                extra = cr.failedCount + "/" + cr.results.length
                                    + " failed";
                            }
                        }
                        statusCell.text( extra );
                    } );
                };
                this.add = function( specRunner ) {
                    var row = new RunnerRow( specRunner );
                    rows.push( row );
                    this.tableEl.append( row.rowEl );
                };
            };
            var runnerTable = new RunnerTable();

            var listeners = [];
            var lintSources = [];
            var filteredLintSources = [];
            var runnersStarted = 0;
            var runnersFinished = 0;
            var windowMessageHandler = function( msg ) {                 
                if ( msg.data ) {
                    if ( msg.data.messageType === "jslint" ) {
                        if ( lintSources.indexOf( msg.data.message.src ) < 0 ) {
                            lintSources.push( msg.data.message.src );
                        }
                    }
                    else if ( msg.data.messageType === "jslintb" ) {
                        var found = msg.data.message.found;

                        $.each( found.allModules, function( i, x ) {
                            if ( lintSources.indexOf( x ) < 0 ) {
                                lintSources.push( x );
                                while( filteredLintSources.indexOf( x ) > 0 ) {
                                    filteredLintSources.remove( x );
                                };
                            }
                        } );
                        $.each( found.filtered, function( i, x ) {
                            if ( lintSources.indexOf( x ) < 0 ) {
                                if ( filteredLintSources.indexOf( x ) < 0 ) {
                                    filteredLintSources.push( x );
                                }
                            };
                        } );
                    }
                    else if (msg.data.messageType === "Started" ) {
                        runnersStarted++;
                    }
                    else if ( msg.data.messageType === "Finished" ) {
                        runnersFinished++;
                        update();
                    }
                }
            };

            if ( window ) {
                window.addEventListener( "message", windowMessageHandler );
            }
            else {
                throw( "KluJS expects a global window object to handle messages." );
            }
            
            var specRunners = [];
            
            var updateTimer;
            
            var globalStatus = "loading";
            
            var add = function( pathToSpecRunner, optName ) {
                var loc = purl( window.location.toString() );
                var altPort = loc.param( "lintPort" ); 
                if ( altPort ) {
                    pathToSpecRunner += "?lintPort=" + altPort;
                };
                var result = new crm.ChildRunner( specRunners.length, 
                                                  pathToSpecRunner,
                                                  optName );
	            specRunners.push( result );
                runnerTable.add( result );
                return result;
            };

            var addSuite = function( suiteName ) {
                add( "GenericSpecRunner.html?suite=" + suiteName );
            };
            
            var buildDivsForSpecRunners = function() {
                var containerDiv = $("#runnerContainer");
                containerDiv.empty();
                containerDiv.append( runnerTable.tableEl );
                $.each( specRunners, function( i, runner ) {
                    var path = runner.path;
		            var div = $("<div />")
                      .addClass("runnerDiv")
                      .appendTo( containerDiv );
		            div.append( $("<div />")
                                .append( titleFor( runner ) ));
		            div.append( runner.frame );
                    div.append( $("<div />").append( reloadButton( i, path ) ));
		        } );
            };
            
            var titleFor = function( childRunner ) {
                return $("<a />").addClass( "runnerTitle" )
                    .append( childRunner.name ? childRunner.name : childRunner.path )
                    .attr( "href", childRunner.path );
            };
            
            var reloadButton = function( i, path ) {
                return $("<button />", { type:"button",
                                         "href":"#",
                                         text:"Reload"} )
	                .addClass( "runnerReload" )
	                .click( function() { runSpec( i ); } );
            };
            
            var runnerFor = function( i, path ) {
                return specRunners[i];
            };
            
            var clearCoverage = function() {
                $.each( _$jscoverage, function(i,x) {
                    $.each( x, function( j,y ) {
                        if( x[j] > 0 && x[j] < 10000000) {
                            x[j] = 0;
                        }
                    } );
                } );
            };
            
            var runAllSpecs = function() {
                clearCoverage();
                $.each( specRunners, function( i, value ) { runSpec( i ); } );
            };
            
            var runSpec = function( i ) {
                specRunners[i].runSpec();
            };
            
            var someOf = function( collection, predicate ) {
                var result = false;
                $.each( collection, function( i, x ) {
                    result = result || predicate( x );
                } );
                return result;
            };

            var specsDone = false;
            var lintDone = false;
            var coverageDone = false;
            var isDone = function() {
                return specsDone && lintDone && coverageDone;
            };
            var runnningStatus = "running";
            var failedStatus = "failed";
            var jobFactory = new lintJob.LintJobFactory();
            var lintCompletion = function(x) {
                if ( jobFactory.isDone() ) {
                    lintDone = true;
                    console.log( "lint done." );
                }
            };
            var doLint = function() {
                var view = new lintView.LintJobFactoryDivView( jobFactory, 
                                                               { filtered : filteredLintSources } );
                view.containingDiv.attr( "id", "jslintContainer" )
                    .appendTo( $("body" ) );
                $.each( lintSources, function( i, src ) {
                    var job = jobFactory.create( i, src );
                } );
                jobFactory.addListener( { completed:lintCompletion });
                jobFactory.runAll();
            };
            
            var update = function() {
                var status = "running";
                var statuses = [];
                $.each( specRunners, 
                        function( i, cr ) { 
                            cr.check();
                            statuses.push( cr.status );
                        } );
                var busy = (runnersFinished !== specRunners.length);
                var failures = someOf( statuses, function(x) { 
                    return x == "failed"; 
                } );
                if( failures ) {
                    if ( busy ) {
                        status = "failing";
                    }
                    else {
                        status = "failed";
                    }
                }
                else {
                    if ( ! busy ) {
                        status = "passed";
                    }
                }
                setStatus( status );
                if ( busy ) {
                    if ( updateTimer ) {
                        clearTimeout( updateTimer );
                    }
                }
                else {
                    specsDone = true;
                    console.log( "Specs done." );
                    doLint();
                    try {
                        $("#jscoverageContainer").remove();
                        coverageView.showCoverage( );                
                        results = getResults();
                    } catch (x) {
                        console.log( "showCoverage failed: " + x );
                        throw x;
                    }
                    coverageDone = true;
                    console.log( "Coverage done." );
                }

            };
            
            var setStatus = function( value ) {
                globalStatus = value;
                $("#headline" ).attr( "class", globalStatus );
                $("#subheadline").empty().append( globalStatus );
                $.each( listeners, function( i, x ) {
                    x( value );
                } );
            };
            
            var getStatus = function() {
                return globalStatus;
            };
            
            var results;
            
            var getResults = function() {
                var result = [];
                $.each( specRunners, function( i, x ) {
                    result.push( {
                        path:x.path,
                        failedCount:x.failedCount,
                        passedCount:x.passedCount,
                        specs:x.getResults() }
                               );
                });
                return result;
            };
            
            
            jasmineKlujs = { add:add,
//                              addSuite:addSuite,
                              buildDivsForSpecRunners:buildDivsForSpecRunners,
                              runAllSpecs:runAllSpecs,
                              getResults:getResults,
                              getStatus:getStatus,
                              update:update,
                              listeners:listeners,
                              lintJobFactory:jobFactory,
                              isDone:isDone
                            };
            return jasmineKlujs;
            
} );



