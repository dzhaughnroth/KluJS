/*global define:false, jasmine:false */
define( [ "./GlobalVariableAccumulator", "../notBackbone", "./LintModel", "../notUnderscore" ], function( GlobalVariableAccumulator, Backbone, LintModel, _ ) {
    
    var LintCollection = Backbone.Collection.extend( {
        initialize: function() {
            this.modelsBySrc = {};
            this.filterMap = {};
        },
        modelFactory : function( attributeHash ) {
            var result = new LintModel( attributeHash );
            return result;
        },
        addFinderResult : function( finderResult ) {
            var self = this;
            // Caution: we assume the filtering logic of all the
            // children are identical here; true enough at the moment.
            this.finderResults = this.finderResults || [];
            this.finderResults.push( finderResult );
            _.each( finderResult.filterMap, function( items, type ) {
                var prevItems = self.filterMap[type];
                if ( ! self.filterMap[type] ) {
                    prevItems = [];
                    self.filterMap[type] = prevItems;
                }
                _.each( items, function( item ) {
                    if ( prevItems.indexOf( item ) === -1 ) {
                        prevItems.push( item );
                    }
                });
            } );
            _.each( finderResult.allModules, function( src, i ) {
                if ( ! self.modelsBySrc[src] ) {
                    var model = self.modelFactory( { src : src } );
                    self.add( model );
                    self.modelsBySrc[src] = model;
                }
            } );
        },
        unfinished : function() {
            return this.filter( function(x) { 
                return !x.get( "done" ); 
            } ).length;
        },
        finished : function() {
            return this.filter( function(x) { 
                return x.get( "done" ); 
            } ).length;
        },
        issueCount : function() {
            return this.map( function(x) { 
                return x.get("done") ? x.issueCount() : 1; 
            } ).reduce( function( memo, num ) { return memo + num; }, 0 );
        },
        passed : function() {
            return this.filter( function(x) { 
                return x.get("done") && x.issueCount() === 0; 
            } ).length;
        },
        failed : function() {
            return this.length - this.passed();
        },
        globals : function() {
            var accum = new GlobalVariableAccumulator();
            this.forEach( function( lm ) {
                accum.addLintData( lm.get("lintData"), lm.get("src") );
            } );
            return accum.globalsAndFiles;
        }
    } );
    
    return LintCollection;


} );
