/*global jasmineGradle: true, $: false, define:false */
define( ["../notBackbone", "../notJQuery", "../notUnderscore"], function(Backbone, $, _) {
    var okClass = "passedCell";
    var failClass = "failedCell";
    
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

            this.$el.empty();
            this.$el.append( $("<td />")
                             .append( $("<a />", {href: model.path, 
                                                  text: model.get( "suite" ) } )));
            
            var resultCell = $("<td />").addClass( "resultCell" );
            var status = model.get("status");
            var text = "Huh? " + status;
            if ( status === "error" ) {
                text = "Error";
            }
            else if ( status === "running" ) {
                text = "...Running...";
            }
            else {
               var results = model.get("results");
                if ( results.failedCount > 0 ) {
                    text = "Failed " + results.failedCount + " of " + results.totalCount + " specs";
                    resultCell.addClass( failClass );
                }
                else {
                    text = "Passed all " + results.totalCount + " specs";
                    resultCell.addClass( okClass );
                }
            }
            resultCell.text( text );
            this.$el.append( resultCell );

            var goalTd = $("<td />", { text:"---" } );
            
            var failureCount = model.get( "coverageGoalFailures" );
            
            if( typeof failureCount !== "undefined") {
                if ( failureCount > 0 ) {
                    goalTd.text( "Missed " + model.get("coverageGoalFailures") + " goal(s)" );
                    goalTd.addClass( failClass );                    
                }
                else {
                    goalTd.text( "Ok" );
                    goalTd.addClass( okClass );
                }
                
            }
            this.$el.append( goalTd );
            
            var deadTd = $("<td />", { text:"---" } ).appendTo( this.$el );
            var deadCode = model.get( "deadCodeResult" );
            if ( typeof deadCode !== "undefined" ) {               
                var msg = "";
                if ( deadCode.dead.length + deadCode.undead.length > 0 ) {
                    deadTd.addClass( failClass );
                    msg = deadCode.dead.length + " dead; " 
                        + deadCode.undead.length + " undead"; 
                }
                else {
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


