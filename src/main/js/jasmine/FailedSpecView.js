/*global define:false, jasmine:false */
define( [ "../notJQuery", "../notUnderscore", "../notBackbone", "./StackTraceView", "./SpecToText" ], function( $, _, Backbone, StackTraceView, SpecToText ) {

    var allLinks = function( spec ) {
        var result = [];
        if ( spec ) {
            result.unshift( SpecToText.link( spec, spec.description ) );
            var parent = spec.suite;
            while( parent ) {
                result.unshift( SpecToText.link( parent, parent.description  ) );
                parent = parent.suite;
            }
        }
        return result;
    };


    var View = Backbone.View.extend( {
        tagName: "div",
        className : "jasmineFailedSpecView",
        _showDetail : true,
        _showPassed : false,
//        showDetail : function( show ) {

//        },
        events : {
            "click .specViewTitle" : "toggleShowPassed"
        },
        noop : function() {},
        toggleShowPassed : function() {
            this.showPassed( !this._showPassed );
        },
        showPassed : function( show ) {
            if ( show ) {
                this.detailEl.find( ".detailItem.passed" ).removeClass( "hidden" );
            }
            else {
                this.detailEl.find( ".detailItem.passed" ).addClass( "hidden" );
            }
            this._showPassed = show;
        },
        detailList : function( results ) {
            var self = this;
            var list = $("<div />").addClass("specDetailList");
            $.each( results.getItems(), function( i, item ) {
                var li = $("<div />", { } )
                        .addClass( "detailItem" )
                        .appendTo( list );
                li.addClass( item.passed() ? "passed" : "failed" );
                var span = $("<span />", { text: (i+1) + ": " + item.toString() } )
                        .addClass( "detailHeadline" )                    
                        .appendTo( li );
                
                if ( item.passed() && ! self._showPassed ) {
                    li.addClass( "hidden" );
                }
                if ( item.trace ) {
                    var traceView = new StackTraceView( { model: item.trace.stack } );
                    li.append( traceView.render().$el );
                    span.click( function() { traceView.toggleShowFullTrace(); } );
                }
            } );
            return list;
        },
        initialize : function() {
            _.bindAll( this, "render", "detailList", "toggleShowPassed", "showPassed", "passedUpdate", "failedUpdate", "runningUpdate", "errorUpdate", "setText" );
            this.model.on( "change", this.render );
            this.titleEl = $("<div />").addClass( "specViewTitle" )
                .addClass( "itemTitle" )
                .appendTo( this.$el );
            this.detailEl = $("<div />").addClass( "specViewDetail" )
                .addClass( "hidden" )
                .addClass( "itemDetail" )
                .appendTo( this.$el );
            
        },
        setText : function( extra ) {
            var self = this;
            var spec = this.model.get("spec");
            var links = allLinks( spec );
            this.titleEl.empty();
            $.each( links, function( i, item ) {
                item.appendTo( self.titleEl );
            } );
            self.titleEl.append( $("<span />", { text: extra } ) );
        },
        passedUpdate : function() {
            this.$el.addClass( "passed" );
            this.$el.removeClass( "failed" );
            this.setText(": passed" );          
            var results = this.model.get("spec").results();
            this.detailEl.empty();
            this.detailEl.append( this.detailList( results ) );
        },        
        failedUpdate : function() {
            this.$el.addClass( "failed" );
            this.$el.removeClass( "passed" );
            this.$el.removeClass( "hidden" );
            this.detailEl.removeClass( "hidden" );
            var s = this.model.get("spec");
            var r = s.results();
            var failures = _.filter( r.getItems(), 
                                     function(item) { return !item.passed(); } 
                                   );
            var text = ": " //this.model.fullDescription() + ": " 
                    + failures.length + "/" + r.getItems().length + " failed";    
            this.setText( text );
//            this.titleEl.text( text );
            var results = this.model.get("spec").results();
            this.detailEl.empty();
            this.detailEl.append( this.detailList( results ) );
        },
        runningUpdate : function() {
            this.setText("");//this.titleEl.text( this.model.fullDescription(  ) );
        },
        errorUpdate : function() {
            this.$el.addClass( "error" );
            this.$el.removeClass( "passed" );
            this.$el.removeClass( "failed" );
            this.$el.removeClass( "hidden" );
            this.setText(": error" );
//            this.titleEl.text( this.titleEl.text() + ": Error" );
            this.detailEl.text( "Error." );
        },
        render : function() {
            var status = this.model.get("status");
            var methodName = status + "Update";
            var update = this[methodName];
            if ( update ) {
                update();
            }
            else {
                this.setText( "" );
            }
            return this;
        }

    } );

    return View;
    
} );
