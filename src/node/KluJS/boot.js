/*globals window:false, klujs:false, require:true */
(function() {
    var _require = {};
    var config = klujs;

    var setIfBlank = function( obj, name, value ) {
        if ( typeof( obj[name] ) === "undefined" ) {
            obj[name] = value;
        }
        return obj;
    };

    var computeKlujsPath = function() {
        var depth = config.mainPath.match( /\//g ).length; 
        var i;
        var result = "";
        for( i = 0; i < depth + 1; i++ ) {
            result += "../";
        }
        return result + "KluJS";
    };
    
    setIfBlank( config, "src", "src" );
    setIfBlank( config, "main", config.src + "/main/js" );
    config.mainPath = config.main;
    setIfBlank( config, "test", config.src + "/test/js" );

    
    setIfBlank( config, "require", {} );
    setIfBlank( config, "requireHome", config.mainPath );
    setIfBlank( config, "libDirs", 
                [ config.main + "/lib", 
                  config.test + "/lib" 
                ] );
    
    _require = config.require;
    _require.baseUrl = config.mainPath;
    setIfBlank( _require, "paths", {} );

    _require.paths.KluJS = computeKlujsPath();

    if ( !config.requireHome.match( "/\.js$" ) ) {
        config.requireHome += "/require.js";//-jquery.js";
    }

    var addBootScriptElement = function() {
        var doc = window.document;
        var el = doc.createElement( "script" );
        el.type = "text/javascript";
        // Infer and/or guess location of require
        el.src = config.requireHome;
        var pathToParamSuite = "KluJS/";
        var moduleName = "js/SuiteBoot.js";
        
        if ( ! window.location.search || ! window.location.search.toString().match( /suite=/ ) ) {
            moduleName = "js/multi/MultiBoot.js";
        }
        
        var attr = doc.createAttribute( "data-main" );
        attr.nodeValue = pathToParamSuite + moduleName;
        el.attributes.setNamedItem( attr );
        
        doc.getElementsByTagName( "head" )[0].appendChild( el );
    };
    

    require = _require;

    if ( typeof( config.noBoot ) === "undefined" ) {
        addBootScriptElement();
    }
    
}() );