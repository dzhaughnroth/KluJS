/** The usual View for the lintJob module. */
/*globals define:false, DivView:true */
define( ["jquery"], function ($) {
    var workingCssClass = "jslintWorking";
    var cssClasses = ["jslintPassed", "jslintFailed"];
    var thisMod = this;
    this.DivView = function( containingDiv, lintJob, src ) {
        var self = this;
        this.lintJob = lintJob;
        var id = lintJob.id;
        var sourceDisplay = function( path ) {
            if( !path ) {
                return "No path";
            }
            var lastSlash = path.lastIndexOf( "/" );
            if ( path.length < 10 || lastSlash < 0 ) {
                return path;
            }
            while ( path.length - lastSlash < 3 ) {
                lastSlash = path.substring( 0, lastSlash - 3).lastIndexOf( "/" );
            }
            return "..." + path.substring( lastSlash + 1 );
        };

        var viewDiv = $("<div />", 
                        { id: id, 
                          text: "JSlint for " + sourceDisplay(src) } )
                .addClass( workingCssClass )
                .appendTo( containingDiv );
        
        var adjustCss = function( passed ) {
            var baseIndex = passed ? 0 : 1;
            viewDiv.removeClass( workingCssClass );
            viewDiv.addClass( cssClasses[baseIndex] );
            viewDiv.removeClass( cssClasses[(baseIndex + 1) % 2] );
        };

        this.update = function( lintJob ) {
            if ( lintJob.error ) {
                this.updateForError( );
            }
            else {
                this.updateForSuccess( );
            }
        };
        
        this.updateForError = function( ) {            
            viewDiv.empty();
            viewDiv.text( this.errorText(self.lintJob));
            adjustCss( false );
        };
        
        this.errorText = function( lintJob ) {
            return sourceDisplay( lintJob.src ) + " failed: " + lintJob.message;
        };
        
        this.updateForSuccess = function( ) {
            viewDiv.empty();            
            viewDiv.append( self.successRenderer( viewDiv, self.lintJob ) );
            adjustCss( self.lintJob.issueCount() === 0 );
        };
        
        this.successRenderer = function( viewDiv, lintJob ) {
            var lintData = lintJob.lintData;
            var errCount = lintJob.issueCount();
            var hasErrors = errCount > 0 || lintJob.error;
            var sourceFileName = sourceDisplay( lintJob.src );
            var headlineText = sourceFileName + ": " 
                    + (hasErrors ? errCount :"No") + " issues";
            var detail = $("<div />", { id:"jslintDetail" + lintJob.id } )
                    .addClass( "hidden" );
            $("<span/>", {text:headlineText, title:lintJob.src} )
                .click( function( event ) {
                    detail.toggleClass( "hidden" );
                } )
                .addClass( "jslintDetailOpener" )
                .appendTo( viewDiv );
            var reloader = $("<button />", {text:"Reload"} )
                    .appendTo( viewDiv );
            reloader.click( function( event ) {
                reloader.text( "Reloading" );
                viewDiv.addClass( workingCssClass );
                self.lintJob.run();                
            } );
            detail.appendTo( viewDiv );
            this.renderDetailDiv( lintData, detail );
        };

        this.renderDetailDiv = function( lintData, detailDiv ) {
            detailDiv.addClass( "hidden" );
            if( !lintData ) {
                $("<p />", {text:"No lint data"} ).appendTo( detailDiv );
                return;
            }
            if ( lintData.implieds && lintData.implieds.length ) {
                var msgs = $( "<p />" ).appendTo( detailDiv );
                msgs.append( "Implied globals: " ); 
                $.each( lintData.implieds, function( i, x ) {
                msgs.append( $("<span />", {text:x.name, title: "line " + x.line} ))
                        .append( "; " );
                } );
            }
            if ( lintData.unused && lintData.unused.length ) {
                var lintMsgs = $( "<p />" ).appendTo( detailDiv );
                lintMsgs.append( "Unused: " ); 
                $.each( lintData.unused, function( i, x ) {
                    lintMsgs.append( $("<span />", 
                                       {text:x.name, 
                                        title: "line " + x.line } ))
                        .append( "; " );
                } );
            }
            if ( lintData.errors ) {
                $.each( lintData.errors, function( i, x ) {
                    var fullEvidence = "(none)";
                    var truncEvidence = "(none)";
                    var lineMessage = "Nothing from jslint!?!?";
                    if ( x ) {
                        if ( x.evidence) {
                            fullEvidence = x.evidence;
                            truncEvidence = x.evidence.length > 80 ? x.evidence.substring( 0, 80 ) + "..." : x.evidence;
                        }
                        lineMessage = "Line " + x.line + ": " + x.reason 
                            + " (" + truncEvidence + ")";
                        detailDiv.append( $("<p />", 
                                            {text: lineMessage, 
                                             title: fullEvidence} )
                                        );
                    }
                } );
            }
        };
        

    };
    var LintJobFactorySummaryView = function( lintJobFactory, found ) {
        var self = this;
        this.jobFactory = lintJobFactory;
        this.summaryDiv = $( "<div />" ).addClass( "jslintBanner" );
        $("<span />").addClass( "jslintTitle" ).text( "JSLint" )
            .appendTo( self.summaryDiv );
        this.summarySpan = $("<span />").addClass( "jslintSummary" ).text( "No files" )
            .appendTo( self.summaryDiv );
        var updateSummary = function( lintJob ) {
            var text = ": " + self.jobFactory.numIssues() + " issues in " 
                                   + self.jobFactory.numFailed() + " files out of " 
                                   + self.jobFactory.numTotal();
            if( typeof( found ) !== "undefined" ) {
                text += " (" +  found.filtered.length + " filtered.)";               
            }
            else {
                text += ".";
            }
           
            self.summarySpan.text( text );
        };
        lintJobFactory.addListener( { created: updateSummary,
                                      completed: updateSummary } );
    };
    this.LintJobFactorySummaryView = LintJobFactorySummaryView;

    this.LintJobFactoryDivView = function( lintJobFactory, found ) {
        this.jobFactory = lintJobFactory;
        this.containingDiv = $( "<div />" );
        this.divViews = {};
        var self = this;
        var addJobDiv = function( lintJob ) {
            var divView = new thisMod.DivView( self.containingDiv, 
                                               lintJob, lintJob.src );
            self.divViews[lintJob.id] = divView;
            self.containingDiv.append( divView.div );
            lintJob.listeners.push( divView );
        };
        lintJobFactory.addListener( { created: addJobDiv } );

        this.summaryView = new LintJobFactorySummaryView( self.jobFactory, found );
        this.summaryView.summaryDiv.appendTo( self.containingDiv );
    };


    return this;


} );