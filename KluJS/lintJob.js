/*globals define:false, JSLINT:false*/
define( ["jquery", "./lib/webjslint", "./proxyLintRunner" ], function($,nothing,ilr) {
    var ljModule = this;
    this.LintJob = function() {
        this.id = undefined;
        this.src = undefined;
        this.done = false;
        this.error = undefined;
        this.message = undefined;
        this.lintData = undefined;
        this.listeners = [];
        var self = this;

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
//            return -1;
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
        this.runner = ilr;
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
            if ( x.issueCount() === 0 ) {
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
            result += x.issueCount();
        } );
        return result;
    };

    this.LintJobFactory.prototype.create = function( id, src ) {
        var result = new ljModule.LintJob();
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
        var ljfSelf = this;
        $.each( this.lintJobs, function( i, job ) {
            ljfSelf.runner.runJob( job );
        } );
    };

    return this;

} );

