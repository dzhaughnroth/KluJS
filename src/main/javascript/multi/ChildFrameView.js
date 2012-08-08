/*global jasmineGradle: true, $: false, define:false */
define( ["../lib/notBackbone", "jquery", "../lib/notUnderscore"], function(Backbone, $, _) {

    var ChildFrameView = Backbone.View.extend( {
        tagName:"tr",
        className: "childFrameView",
        initialize : function() {
            _.bindAll( this, "render" );
            this.model.on( 'change', this.render );
        },
        events: {
            "click .resultCell" : "selectFrame"
        },
        selectFrame: function() {
            this.model.frame.toggleClass( "hidden" );
        },
        render : function() {
            var model = this.model;
            var status = model.get("status");
            var text = "Huh? " + status;
            if ( status === "running" ) {
                text = "...Running...";
            }
            else {
                var results = model.get("results" );
                if ( results.failedCount > 0 ) {
                    text = "Failed " + results.failedCount + " of " + results.count + " specs";
                }
                else {
                    text = "Passed all " +results.count + " specs";
                }
            }
            this.$el.empty();
            this.$el.append( $("<td />")
                             .append( $("<a />", {href: model.path, 
                                                  text: model.get( "suite" ) } )));
            this.$el.append( $("<td />", { text: text } ).addClass( "resultCell" ) );

            var goalTd = $("<td />", { text:"---" } );
            
            var failureCount = model.get( "coverageGoalFailures" );
            
            if( typeof failureCount !== "undefined") {
                if ( failureCount > 0 ) {
                    goalTd.text( "Missed " + model.get("coverageGoalFailures") + " goal(s)" );
                    goalTd.addClass("coverageGoalFailed");                    
                }
                else {
                    goalTd.text( "Ok" );
                    goalTd.addClass("allCoverageGoalsPassed");
                }
                
            }
            this.$el.append( goalTd );
            return this;
        }


    } );


    return ChildFrameView;

} );


