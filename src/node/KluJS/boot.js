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
    setIfBlank( config, "main", config.src + "/main/javascript" );
    config.mainPath = "../" + config.main;
    setIfBlank( config, "test", config.src + "/test/javascript" );

    
    setIfBlank( config, "require", {} );
    setIfBlank( config, "requireHome", config.mainPath );
    setIfBlank( config, "libDirs", 
                [ "src/main/javascript/lib", 
                  "src/test/javascript/lib" 
                ] );
    
    _require = config.require;
    _require.baseUrl = config.mainPath;
    setIfBlank( _require, "paths", {} );

    _require.paths.KluJS = computeKlujsPath();

    if ( !config.requireHome.match( "/js$" ) ) {
        config.requireHome += "/require-jquery.js";
    }

    var addBootScriptElement = function() {
        var doc = window.document;
        var el = doc.createElement( "script" );
        el.type = "text/javascript";
        // Infer and/or guess location of require
        el.src = config.requireHome;
        var pathToParamSuite = "KluJS/";
        var moduleName = "javascript/SuiteBoot.js";
        
        if ( ! window.location.search || ! window.location.search.toString().match( /suite=/ ) ) {
            moduleName = "javascript/multi/MultiBoot.js";
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