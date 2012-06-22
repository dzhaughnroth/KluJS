/*global define:false, jasmine:false */
define( ["backbone", "underscore", "jquery", "../lib/text!./lintTemplate.html" ], function( Backbone, _, $, lintTemplate ) {

    var messages = function( lintData ) {
        var result = [];
        var msg;
        if ( !lintData ) {
            return result;
        }
        if ( lintData.implieds ) {
            msg = "Implied globals: "; 
            $.each( lintData.implieds, function( i, x ) {
                msg += " <span title='line " + x.line + "' >" + x.name + ";</span>\n";
            } );
            result.push( msg );
        }
        if ( lintData.unused ) {
            msg = "Unused: ";
            $.each( lintData.unused, function( i, x ) {
                msg += "<span title='line " + x.line + "' >" + x.name + "</span>\n";
            } );
            result.push( msg );
        }
        if ( lintData.errors ) {
            $.each( lintData.errors, function( i, x ) {
                var fullEvidence = "(none)";
                var truncEvidence = "(none)";
                var lineMessage = "???";
                if ( x ) {
                    if ( x.evidence) {
                        fullEvidence = x.evidence;
                        truncEvidence = x.evidence.length > 80 ? x.evidence.substring( 0, 80 ) + "..." : x.evidence;
                    }
                    lineMessage = "Line " + x.line + ": " + x.reason 
                        + " (" + truncEvidence + ")";
                }
                result.push( "<span title='" + _.escape(fullEvidence) + "' >" + _.escape(lineMessage) + "</span>\n" );
            } );
        }
        return result;
    };

    var LintView = Backbone.View.extend( {
        tagName:"div",
        className:"lintItem",
        template: _.template( lintTemplate),
        initialize : function() {
            _.bindAll(this, 'render', 'adjustClass');
            this.model.on('change', this.render);
        },
        events: {
            "click .lintItemHeadline" : "toggleHidden",
            "click .reload" : "reload"
        },
        reload : function() {
            this.model.check();
        },
        toggleHidden : function() {
            this.$el.children( ".lintDetail" ).toggleClass("hidden");
        },
        showDetail: function() {
            this.$el.children( ".lintDetail" ).removeClass("hidden");
        },
        adjustClass: function( data ) {
            var self = this;
            var clazz = "running";
            if ( data.done === true ) {
                if ( data.error || data.issueCount > 0 ) {
                    clazz = "failed";
                }
                else {
                    clazz = "passed";
                }
            }

            $.each( ["running", "failed", "passed"], function( i, x ) {
                if ( x !== clazz && self.$el.hasClass( x ) ) {
                    self.$el.removeClass(x);
                }
            } );
            this.$el.addClass( clazz );
        },
        render: function() {
            var data = this.model.toJSON();
            if ( data.done ) {
                if ( ! data.error ) {
                    data.issueCount = this.model.issueCount();
                }
                else { 
                    data.issueCount = 1000;
                }
            }
            else {
                data.issueCount = 0;
            }
            data.messages = messages( data.lintData );
            this.adjustClass( data );
            this.$el.html( this.template( data ));           
            return this;
        }
    });

    return LintView;

} );
