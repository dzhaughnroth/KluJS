/*globals define:false, $$_l:false */
define( [ "./notBackbone", "./notUnderscore", "./notJQuery" ], function( Backbone, _, $ ) {

    var Model = Backbone.Model.extend( { } );

    var View = Backbone.View.extend( {
        tagName: "div",
        className: "suiteName",
        initialize: function() {
            _.bindAll(this, 'render');
           this.model.on( "change", this.render );
        },
        render: function() {
            var value = this.model.get( "suiteName" );            
            if ( ! value ) {
                value = "...loading...";
            }
            this.$el.empty();
            var title = $("<a />", {text: "KluJS",
                                    title: "Run all suites",
                                    href: "."} )
                    .addClass( "klujsLink" );
            var suiteName = $("<a />", {text: value,
                                        title: "Run this suite again",
                                        href: "/?suite=" + value } )
                    .addClass( "suiteLink" );
            var nocov = $("<a />", {text: "(Disable code coverage)",
                                    title: "Disable code coverage",
                                    href: "nocov?suite=" + value } )
                    .addClass( "noCoverageLink" );
            this.$el.append( title ).append( suiteName ).append( nocov );
      

            return this;
        }

    } );

    return {
        Model:Model,
        View:View
    };
} );