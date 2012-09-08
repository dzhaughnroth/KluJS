/*global define:false, jasmine:false */
define( [ "../notJQuery", "../notUnderscore", "../notBackbone", "./SpecModel"], function( $, _, Backbone, SpecModel ) {

    var Model;
    Model = Backbone.Model.extend( {
        // suite
        // done
        initialize : function() {
            var self = this;
            _.bindAll( this, "rollupIdMaps" );
            this.specModels = {};
            this.suiteModels = {};
            var computeChildren = function() {
                var suite = this.get( "suite" );
                $.each( suite.specs(), function( i, spec ) {
                    var specModel = new SpecModel();
                    self.specModels[spec.id] = specModel;                
                    specModel.set( "spec", spec );
                } );
                $.each( suite.suites(), function( i, suite ) {
                    var suiteModel = new Model();
                    self.suiteModels[suite.id] = suiteModel;
                    suiteModel.set( "suite", suite );
                } );
            };
            this.on( "change:suite", computeChildren );
//            this.on( "change:done", function() {
//                if ( self.get("done") ) {
//                    $.each( self.specModels, function( i, spec ) {
//                        if ( ! spec.get( "done" ) ) {
//                            console.log( "Forcing " + spec.id + " " + spec.description 
//                                         + " to be done" );
//                            spec.set( "done", true );
//                        }
//                    } );
//                }
//            });

        },
        rollupIdMaps : function( suiteMap, specMap ) {
            $.each( this.specModels, function( id, model ) {
                specMap[id] = model;
            } );
            $.each( this.suiteModels, function( id, model ) {
                suiteMap[id] = model;
                model.rollupIdMaps( suiteMap, specMap );
            } );
            suiteMap[ this.get("suite").id ] = this;
        }

    } );

    return Model;

} );
