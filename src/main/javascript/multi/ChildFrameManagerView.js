/*global jasmineGradle: true, $: false, define:false */
define( ["backbone", "jquery", "underscore"], function(Backbone, $, _) {

    var ChildFrameManagerView = Backbone.View.extend( {
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
            $("#frame" + this.model.cid ).toggleClass( "hidden" );
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
            return this;
        }


    } );


    return ChildFrameManagerView;

} );


