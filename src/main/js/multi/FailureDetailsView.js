/*global jasmineGradle: true, $: false, define:false */
define( [ "../notBackbone", "../notJQuery", "../notUnderscore"], function( Backbone, $, _) {

    var FailureDetailsView = Backbone.View.extend( {
	tagName:"div",
	className:"suiteFailuresView",
        initialize : function() {
            _.bindAll( this, "render" );
            this.model.on( 'change', this.render );
        },
        render : function() {    
            var model = this.model;
	    if ( model.isDone() ) {
		this.$el.empty();
		this.$el.append( "Failure Details:" );
		this.$el.append( $("<pre />", { text : JSON.stringify( this.model.getFailedSpecDetails(), 0, 2 ) } ) );
	    }
	    else {
		this.$el.empty();
		this.$el.append( "Not all done yet." );
	    }   
            return this;
        }
    } );
					   
    return FailureDetailsView;

} );


