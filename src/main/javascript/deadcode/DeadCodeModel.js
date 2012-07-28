/*globals define:false, klujs:false, jasmine:false */
define( [ "../lib/notBackbone", "../lib/notUnderscore", "jquery" ], function( Backbone, _, $ ) {

    var findDeadCode = function( codeList, coverageData ) {
        var result = [];
        $.each( codeList, function( i, name ) {
            if( typeof coverageData.lines[name] === "undefined" ) {
                result.push( name );
            }
        } );
        return result;
    };

    var DeadCodeModel = Backbone.Model.extend( {
        initialize: function() {
            var self = this;
            _.bindAll( this, "check" );
            var bindToCheck = function( model ) {
                model.on( "change", self.check );
            };               
            bindToCheck( self.get( "codeListModel" ) );
            bindToCheck( self.get( "coverageDataModel" ));
            self.check();
        },
        check : function() {
            var self = this;
            var codeList = self.get("codeListModel").get("codeList");
            var coverageData = self.get( "coverageDataModel" ).get( "coverageData" );
            if ( codeList && coverageData ) {
                this.set("deadCode", findDeadCode( codeList, coverageData ) );
            }
        }

    } );
    return DeadCodeModel;
} );
