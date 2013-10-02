/*global jasmineGradle: true, $: false, define:false */
define( [ "./ChildFrameCollection", "../notBackbone", "../notJQuery", "../notUnderscore"], function(ChildFrameCollection, Backbone, $, _) {

    var SuiteFailuresView = Backbone.View.extend( {
	tagName:"div",
	className:"suiteFailuresView",
        initialize : function() {
            _.bindAll( this, "render" );
            this.model.on( 'change', this.render );
        },
        render : function() {
            var model = this.model;
            this.$el.empty();
	    this.$el.append( $("<div />", { text: this.model.get("suite") } ) );
	    this.$el.append( $("<div />", { text : JSON.stringify( this.model.get( "failureDetails" ), 0, 2 ) } );
            return this;
        }
    } );
					   
    var FailureDetailsView = Backbone.View.extend( {
        tagName: "div",
        className: "multiFailureDetailsView",
        model: ChildFrameCollection.Model,
        initialize: function() {
            _.bindAll( this, "render" );
            var header = $( "<tr />" )
                    .append( $( "<th />", {text: "Suite" } ) )
                    .append( $( "<th />", {text: "Results"} ) )
                    .append( $( "<th />", {text: "Coverage" } ) )
                    .append( $( "<th />", {text: "Dead code" } ) );
            this.header = $( "<thead />" ).append( header );
            this.tbody = $( "<tbody />" );
            this.$el.append( this.header );
            this.$el.append( this.tbody );
            this.model.on( "add", this.render );
        },
        subviews : {},
        render: function() {
            var self = this;
            this.model.forEach( function( childModel ) { 
                if ( ! self.subviews[childModel.get("suite")] ) {
                    var suiteView = new SuiteFailuresView( { model:childModel } ).render();
                    self.subviews[childModel.get("suite")] = suiteView;
                    self.$el.append( suiteView.$el );
                }
            } );
            return this;
        }
    } );


    return FailureDetailsView;

} );


