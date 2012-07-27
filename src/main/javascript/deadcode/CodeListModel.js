/*globals define:false, klujs:false, jasmine:false */
define( [ "../lib/notBackbone", "../lib/notUnderscore", "jquery" ], function( Backbone, _, $ ) {

    var CodeListModel = Backbone.Model.extend( {
        defaults : {
            src : "klujs-codeList.json"
            // codeList on success
            // error on error.
        },
        initialize: function() {
            _.bindAll( this, "fetch" );
        },
        fetch : function() {
            var self = this;
            var src = this.get("src");
            $.ajax( src, { async:true, dataType:"json" } )
                .done( function( data ) {
                    self.set( "codeList", data );
                } )
                .error( function() {
                    self.set( "error", arguments );
                } );
        }

    } );
    return CodeListModel;
} );
