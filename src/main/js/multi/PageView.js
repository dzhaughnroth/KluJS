/*global define:false, window:false */
define( [ "./ChildFrameCollection", "../lint/LintCollectionView", "../coverage/CoverageDataView", "../deadcode/DeadCodeView", "../notBackbone", "../notJQuery", "../notUnderscore", "require" ], function( ChildFrameCollection, LintCollectionView, CoverageDataView, DeadCodeView, Backbone, $, _, req ) {

    var linkToCss = function( name ) {
        return $("<link />")
            .attr( "rel", "stylesheet" )
            .attr( "type", "text/css" )
            .attr( "href", req.toUrl( "../lib/" + name ) );
    };

    // args are optional, just for testing
    var PageView = Backbone.View.extend( {
        tagName: "div",
        className: "klujsPage",
        renderedOnce: false,
        initialize: function() {
            _.bindAll( this, "render" );
            this.headElement = $("head");
            this.bodyElement = $("body");
        },
        render: function() {
            if ( !this.renderedOnce ) {
                this.headElement.append( linkToCss( "jasmine.css" ) )
                    .append( linkToCss( "klujs.css" ) )
                    .append( linkToCss( "data_table.css" ) );
                var model = this.model;
                var view = new ChildFrameCollection.CompositeView( {model:model.childFrames} )
                        .render();
                var lintView = new LintCollectionView( { model:model.lintModel} )
                        .render(); 
                var deadCodeView = new DeadCodeView( { model:model.deadCodeModel } )
                        .render();
                var coverageView = new CoverageDataView( { 
                    model:model.coverageDataModel,
                    disableGoals:true
                } ).render();
                var titleDiv = $("<div />" )
                        .append( $( "<a />", { text:"KluJS: All Suites",
                                               title: "Run all suites",
                                               href: "."} )
                                 .addClass( "klujsLink") )
                        .append( $( "<a />", { text:"(Disable code coverage)",
                                               title: "Disable code coverage",
                                               href: "nocov"} )
                                 .addClass( "noCoverageLink" ) );
                titleDiv.appendTo( this.bodyElement );
                this.bodyElement.append( view.$el );
                this.bodyElement.append( lintView.$el );
                this.bodyElement.append( deadCodeView.$el );
                this.bodyElement.append( coverageView.$el );
                this.bodyElement.append( $("<div />", {text:"Started at " + new Date() }));
                this.renderedOnce = true;
            }
            return this;
        }
    } );

    return PageView;

} );
