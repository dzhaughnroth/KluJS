/*globals define:false, $$_l:false */
define( [ "./lib/notBackbone", "./lib/notUnderscore", "jquery" ], function( Backbone, _, $ ) {

    var Model = Backbone.Model.extend( { } );

    var View = Backbone.View.extend( {
        tagName: "h1",
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
            this.$el.text( "KluJS: " + value );
            return this;
        }

    } );

    return {
        Model:Model,
        View:View
    };
} );