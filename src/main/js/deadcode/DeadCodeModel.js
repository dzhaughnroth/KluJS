/*globals define:false, klujs:false, jasmine:false */
define( [ "../notBackbone", "../notUnderscore", "../notJQuery" ], function( Backbone, _, $ ) {

    var checkExceptions = function( name, list ) {
        var result = false;
        $.each( list, function( i, x ) { 
            if ( name === x ) {
                result = true;
            }
        } );
        return result;
    };

    var findDeadCode = function( codeList, coverageData, exceptions ) {
        var dead = [];
        var permitted = [];
        var undead = [];
        var rules = exceptions || [];
        $.each( codeList, function( i, name ) {           
            var named = checkExceptions( name, rules );
            var missing = typeof coverageData.lines[name] === "undefined";
            
            var bucket;
            if ( named ) {
                bucket = (missing ? permitted : undead);
            }
            else if ( missing ) {
                bucket = dead;
            }
            if ( bucket ) { 
                bucket.push( name );
            }
        } );
        return {
            permitted : permitted,
            undead : undead,
            dead : dead
        };
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
                this.set("deadCode", findDeadCode( codeList, coverageData, 
                                                   this.get("exceptions") ) );
            }
        }

    } );
    return DeadCodeModel;
} );
