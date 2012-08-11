/*global jasmineGradle: true, $: false, define:false */
define( ["../notBackbone", "../notJQuery", "../notUnderscore"], function(Backbone, $, _) {

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
            if ( status === "error" ) {
                text = "Error";
            }
            else if ( status === "running" ) {
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
            
            var deadTd = $("<td />", { text:"---" } ).appendTo( this.$el );
            var deadCode = model.get( "deadCodeResult" );
            if ( typeof deadCode !== "undefined" ) {               
                var okClass = "deadCodeOk";
                var failClass = "deadCodeFailed";
                var msg = "";
                if ( deadCode.dead.length + deadCode.undead.length > 0 ) {
                    deadTd.removeClass( okClass );
                    deadTd.addClass( failClass );
                    msg = deadCode.dead.length + " dead; " 
                        + deadCode.undead.length + " undead"; 
                }
                else {
                    deadTd.removeClass( failClass );
                    deadTd.addClass( okClass );
                    msg = "Ok";
                }
                if ( deadCode.permitted.length > 0 ) {
                    msg += "; " + deadCode.permitted.length + " permitted";
                }
                deadTd.text( msg );
            }
            
            return this;
        }


    } );


    return ChildFrameView;

} );


