/*globals define:false, klujs:false, jasmine:false */
define( [ "../lib/notBackbone", "../lib/notUnderscore", "jquery" ], function( Backbone, _, $ ) {
    var findDeadCode = function() {
        return [];
    };
    var DeadCodeModel = Backbone.Model.extend( {
        initialize: function() {
            var self = this;
            _.bindAll( this, "check" );
            var bindToCheck = function( model ) {
                model.on( "change", self.check );
            };               
            var prepareBind = function( name ) {
                if ( self.get( name ) ) {
                    bindToCheck( self.get( name ) );
                }
                else {
                    this.on( "change:" + name, function() {
                        bindToCheck( self.get( name ) );
                    } );
                }
            };
            prepareBind( "codeListModel" );
            prepareBind( "coverageDataModel" );
            self.check();
        },
        check : function() {
            var clModel = self.get( "codeListModel" );
            var cdModel = self.get( "coverageDataModel" );
            if ( clModel && cdModel ) {
                var codeList = clModel.get("codeList");
                var coverageData = cdModel.get( "coverageData" );
                if ( codeList && coverageData ) {
                    this.set("deadCode", findDeadCode( codeList, coverageData ) );
                }
            }
        }

    } );
    return CodeListModel;
} );
