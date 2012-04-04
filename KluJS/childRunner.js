/*global jasmineGradle: true, $: false, define:false */
define( ["jquery"], function($) {
    var RUNNING = "running";
    var FAILED = "failed";
    var PASSED = "passed";
    var loaded = function() {
        this.loaded = true;
    };
    this.ChildRunner = function( id, path, name ) {
        this.id = id;
        this.path = path;
        this.name = name;
        this.status = RUNNING;
        this.results = undefined;
        this.failedCount = 0;
        this.passedCount = 0;
        this.frame = $( "<iframe />" ).attr( "name", "frame" + id)
            .attr( "id", "frame" + id )
            .attr( "src", path )
            .addClass( "childSpecRunnerFrame" )
            .append( "No iframes support" );        
        this.frame = this.frame[0];
        this.frame.onload = loaded;
        this.listeners = [];
        this.loaded = false;
    };

    this.ChildRunner.prototype.isDone = function() {
        return this.status !== RUNNING;
    };

    this.ChildRunner.prototype.isPassed = function() {
        return this.status === PASSED;
    };

    this.ChildRunner.prototype.isFailed = function() {
        return this.status === FAILED;
    };

    this.ChildRunner.prototype.setStatus = function( newStatus ) {
        this.status = newStatus;
        var self = this;
        $.each( this.listeners, function( i, x ) {
            x( newStatus, self );
        } );
    };

    this.ChildRunner.prototype.runSpec = function( ) {
        this.frame.contentWindow.location.reload(true);
    };

    this.ChildRunner.prototype.check = function( ) {
        var node = this.frame.contentWindow;
        var self = this;
        if ( node && node.apiReporter && node.apiReporter.finished ) {
            self.failedCount = 0;
            self.passedCount = 0;
            var results = [];
            $.each( node.apiReporter.results(), function( i, r ) {
                results.push( r );
                if ( r.result === "failed" ) {
                    ++self.failedCount;
                }
                if ( r.result === "passed" ) {
                    ++self.passedCount;
                }
            } );
            this.results = results;
            if ( self.failedCount > 0 ) {
                this.setStatus(FAILED);
            }
            else {
                this.setStatus(PASSED);
            }
        }
        else {
            this.setStatus( RUNNING );
        }
    };

///
    this.ChildRunner.prototype.specPaths = function( reporter ) {
        var result = [];
        var specPath = "/";
        this.addSubpaths( reporter, result, specPath, reporter.suites() );
        return result;
    };
    
    this.ChildRunner.prototype.addSubpaths = 
        function( reporter, accum, pathSoFar, specsOrSuites ) {
            var crSelf = this;
            $.each( specsOrSuites, function( i, x ) {
                var mypath = pathSoFar + ":" + x.name;
                if ( x.children && x.children.length > 0) {
                    crSelf.addSubpaths( reporter, accum, mypath, x.children );
                }
                if ( x.type === "spec" ) {
                    accum.push( { path: mypath, specId: x.id } );
                } 
            } );
        };
    
    this.ChildRunner.prototype.getResults = function() {
        var result = [];
        var reporter = this.frame.contentWindow.apiReporter;
        var sps = this.specPaths( reporter );
        $.each( sps, function ( j, y ) {
            var specResult = reporter.resultsForSpecs( [y.specId] )[y.specId];


            $.each( specResult.messages, function( a, b ) {
                var stack = "";
                if ( b.trace.stack ) {
                    var chomped = b.trace.stack.split( "\n" );
                    $.each( chomped, function( i, x ) {
                        if ( !x.match( /KluJS/ ) ) {
                            stack += x + "\n";
                        }
                    } );
                }
                result.push( {
                    page: this.id,
                    path: y.path,
                    passed: b.passed,
                    message: b.message,
                    stacktrace:stack
                } );
            });
        } );
        return result;
    };

    return this;

} );


