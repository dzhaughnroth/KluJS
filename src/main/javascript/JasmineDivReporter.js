/*global define:false, jasmine:false */
define( [ "jquery", "./widgets/Checkbox" ], function( $, Checkbox ) {

    // argument is optional, only for testing.
    var create = function( jmodel, HtmlReporterConstructor ) {
        var constructor = HtmlReporterConstructor || jasmine.HtmlReporter;
        var self = this;
        var showDetailsModel = new Checkbox.Model( { checked:false,
                                                         label: "Show Specs" } );
        
        var showPassingLabel = new Checkbox.Label( { model:showDetailsModel } )
                .render();
        
        var showPassingView = new Checkbox.View( { model:showDetailsModel } )
                .render();
        showPassingView.$el.addClass( "showPassing" );

        var pseudoDoc = {
            body : {
                appendChild : function( jasmineChild ) {
                    self.$el.append( $(jasmineChild) );
                }
            },
            location : {
                search : ""
            }
        };

        var adjustVisibility = function( ) {
            var show = showDetailsModel.get( "checked" );
            var reporter = self.$el.children(".jasmine_reporter");
            if ( reporter.length === 0 ) {
                return;
            }
            if( show ) {
                reporter.removeClass( "minimized" );
            }
            else {
                reporter.addClass( "minimized" );
            }

            var alertBar = reporter.find( ".bar.passingAlert" );
            if ( alertBar.length === 0 ) {
                alertBar = reporter.find( ".bar.failingAlert" );
            }
            if ( alertBar.find( ".showPassing" ).length === 0 ) {
                alertBar
                    .append( showPassingView.$el )
                    .append( showPassingLabel.$el );
            }

        };

        showDetailsModel.on( 'change', adjustVisibility );

        jmodel.on( 'change', function( ) {
            var result = jmodel.get("result");
            if ( jmodel.get("status") !== "done" ) {
                return;
            }
            showDetailsModel.set( "checked", result.failed > 0 );
            adjustVisibility();
        } );

        this.$el = $("<div />");
        this.reporter = new constructor( pseudoDoc );
    };
    
    return create;
    
} );
