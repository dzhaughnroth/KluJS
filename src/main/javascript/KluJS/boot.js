/*globals window:false, klujsConfig:false, require:false */
var _req = require;
var _klujsConfig = klujsConfig;
var doc = window.document;
var el = doc.createElement( "script" );
el.type = "text/javascript";
// Infer and/or guess location of require
if ( _req && _req.baseUrl ) {
    el.src = _req.baseUrl;
}
if ( _klujsConfig && _klujsConfig.requireHome ) {
    el.src = _klujsConfig.requireHome;
}
if ( ! el.src.match( /js$/ ) ) {
    el.src = el.src + "/require-jquery.js";
}

var pathToParamSuite = "KluJS";
var moduleName = "/paramSuite";
if ( _klujsConfig && _klujsConfig.klujsHome ) {
    pathToParamSuite = _klujsConfig.klujsHome;
}

if ( ! window.location.search || ! window.location.search.toString().match( /suite=/ ) ) {
    moduleName = "/polyMain";
}

var attr = doc.createAttribute( "data-main" );
attr.nodeValue = pathToParamSuite + moduleName;
el.attributes.setNamedItem( attr );

doc.getElementsByTagName( "head" )[0].appendChild( el );

