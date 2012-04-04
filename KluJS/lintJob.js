/*globals define:false, JSLINT:false*/
define( ["jquery", "./lib/webjslint", "./proxyLintRunner" ], function($,nothing,LintRunner) {

     var ljModule = this;

    this.LintJob = function( ilr ) {
        this.id = undefined;
        this.src = undefined;
        this.listeners = [];

        var self = this;
        
        var init = function() {
            self.done = false;
            self.error = undefined;
            self.message = undefined;
            self.lintData = undefined;            
        };

        init();

        this.run = function() {
            init();            
            $.each( self.listeners, function( i, x ) {
                if ( x.started ) {
                    x.started( self );
                }
            });
            ilr.runJob( self );
        };

        var complete = function() {
            self.done = true;
            $.each( self.listeners, function(i,x) { 
                x.update( self );
            } );
         };

        this.succeed = function( data ) {
            self.lintData = data;
            self.error = false;
            complete();
        };
        
        this.fail = function( message, optionalData ) {
            self.error = true;
            self.message = message;
            self.lintData = optionalData;
            complete();
        };

        this.process = function( jsText ) {
            try {
                JSLINT( jsText, {} );
                self.succeed( JSLINT.data() );
            }
            catch( e ) {
                self.fail( "JSLint failed: " + e, JSLINT.data() );
            }
        };


    };

    this.LintJob.prototype.issueCount = function() {
        var data = this.lintData;
        if ( ! data ) {
            throw( "No JSLINT data" );
        }
        var errCount = data.errors ? data.errors.length : 0;
        if ( data.implieds && data.implieds.length ) {
            ++errCount;
        }
        if ( data.unused && data.unused.length ) {
            ++errCount;
        }
        return errCount;
    };



    /** A Listener has a method( "update( lintJob )" ); A ViewFactory
     has a method createListener( id, src ) that returns a View for a
     generated id and uri to the javascript source. */
    this.LintJobFactory = function( ) {
        this.runner = new LintRunner();
        this.lintJobs = {};
        this.jobsInProgress = {};
        this.jobsCompleted = {};
        this._listeners = [];
    };

    this.LintJobFactory.prototype.addListener = function( l ) {
        this._listeners.push( l );
    };

    this.LintJobFactory.prototype.isDone = function() {
        var result = true;
        $.each( this.jobsInProgress, function() {
            result = false;
        } );
        return result;
    };

    this.LintJobFactory.prototype.numTotal = function() {
        var result = 0;
        $.each( this.lintJobs, function( i, x ) {
            ++result;
        } );
        return result;
    };

    this.LintJobFactory.prototype.numPassed = function() {
        var result = 0;
        $.each( this.jobsCompleted, function( i, x ) {
            if ( x.lintData && x.issueCount() === 0 ) {
                ++result;
            }
        } );
        return result;
    };
    this.LintJobFactory.prototype.numFailed = function() {
        return this.numTotal() - this.numPassed();
    };

    this.LintJobFactory.prototype.numIssues = function() {
        var result = 0;
        $.each( this.jobsCompleted, function( i, x ) {
            if ( x.lintData ) {
                result += x.issueCount();
            }
            else {
                result++;
            }
        } );
        return result;
    };

    this.LintJobFactory.prototype.create = function( id, src ) {
        var result = new ljModule.LintJob( this.runner );
        this.lintJobs[id] = result;
        this.jobsInProgress[id] = result;
        var self = this;

        result.id = id;
        result.src = src;
        var completionListener = { 
            update: function(lintJob) {
                delete self.jobsInProgress[lintJob.id];
                self.jobsCompleted[lintJob.id] = lintJob;
                $.each( self._listeners, function( i, l ) {
                    if ( l.completed ) {
                        l.completed( lintJob );
                    }
                } );
            },
            started: function( lintJob ) {
                delete self.jobsCompleted[lintJob.id];
                self.jobsInProgress[lintJob.id] = lintJob;
            }
        };
        result.listeners.push( completionListener );
        $.each( self._listeners, function( i, l ) {
            if ( l.created ) {
                l.created( result );
            }
        } );
        return result;
    };

    this.LintJobFactory.prototype.runAll = function() {
        $.each( this.lintJobs, function( i, job ) {
            job.run();
        } );
    };

    return this;

} );

