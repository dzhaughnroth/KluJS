/*global define:false, jasmine:false */
define( ["backbone", "underscore"], function( Backbone, _ ) {

    /** 
     * View of a LintCollection that summarizes counts of passed and
     * failed.  Also includes a dumb little local model about whether
     * to show or hid passed lint items; a containing view may listen
     * to this.
     */  

    var Model = Backbone.Model.extend( {
        defaults : { checked : false,
                     label : "Lorem ipsum" },
        toggle : function() {
            this.set("checked", !this.get("checked") );
        }
    } );

    var Label = Backbone.View.extend( {
        tagName:"span",
        events: { 
            "click" : "toggle"
        },
        initialize : function() {
            _.bindAll( this, "toggle", "render" );
            this.model.on( 'change', this.render );
        },
        toggle : function() { this.model.toggle(); },
        render : function() {
            this.$el.text( this.model.get( "label" ) );
            return this;
        }
    } );

    var View = Backbone.View.extend( {
        tagName:"input",
        events: {
            "change" : "toggle"
        },
        initialize : function() {
            _.bindAll( this, "render", "toggle" );
            this.model.on( 'change', this.render );
            this.$el.attr( "type", "checkbox" );
        },
        toggle : function() { this.model.toggle(); },
        render : function() {
            if ( this.model.get( "checked" ) ) {
                this.$el.attr( "checked", "checked" );
            }
            else {
                this.$el.removeAttr( "checked" );
            }
            return this;
        }
    } );

    return {
        Model:Model,
        View:View,
        Label:Label
    };
    
} );

