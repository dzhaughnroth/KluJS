/*globals window:false, klujs:false, require:true */
(function() {
    var _require = {};
    var _klujs = klujs;

    var setIfBlank = function( obj, name, value ) {
        if ( typeof( obj[name] ) === "undefined" ) {
            obj[name] = value;
        }
        return obj;
    };

    var computeKlujsPath = function() {
        var depth = _klujs.main.match( /\//g ).length, 
            i;
        var result = "";
        for( i = 0; i < depth + 1; i++ ) {
            result += "../";
        }
        return result += "KluJS";
    };
    
    setIfBlank( _klujs, "main", "src/main/javascript" );
    _klujs.main = "../" + _klujs.main;
    setIfBlank( _klujs, "test", "src/test/javascript" );
    _klujs.test = "../" + _klujs.test;
    
    setIfBlank( _klujs, "require", {} );
    setIfBlank( _klujs, "requireHome", _klujs.main );
    setIfBlank( _klujs, "libDirs", 
                [ "src/main/javascript/lib", 
                  "src/test/javascript/lib" 
                ] );
    
    _require = _klujs.require;
    _require.baseUrl = _klujs.main;
    setIfBlank( _require, "paths", {} );

    _require.paths.KluJS = computeKlujsPath();

    if ( !_klujs.requireHome.match( "/js$" ) ) {
        _klujs.requireHome += "/require-jquery.js";
    }
    
    var addBootScriptElement = function() {
        var doc = window.document;
        var el = doc.createElement( "script" );
        el.type = "text/javascript";
        // Infer and/or guess location of require
        el.src = _klujs.requireHome;
        var pathToParamSuite = "KluJS/";
        var moduleName = "paramSuite";
        
        if ( ! window.location.search || ! window.location.search.toString().match( /suite=/ ) ) {
            moduleName = "polyMain";
        }
        
        var attr = doc.createAttribute( "data-main" );
        attr.nodeValue = pathToParamSuite + moduleName;
        el.attributes.setNamedItem( attr );
        
        doc.getElementsByTagName( "head" )[0].appendChild( el );
    };
    

    require = _require;

    if ( typeof( _klujs.noBoot ) === "undefined" ) {
        addBootScriptElement();
    }
//    else { console.log( "No boot." );  }
    
}() );