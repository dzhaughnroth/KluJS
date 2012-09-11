/*global define:false, jasmine:false */
define( [ "../notJQuery", "../notUnderscore", "../notBackbone", "../lib/purl" ], function( $, _, Backbone, purlPkg ) {
    var purl = purlPkg();
    var briefDescription = function(spec) {
        var text = "";
        if ( spec ) {
            text = spec.description;
        }
        return text;
    };
    var fullDescription = function(spec) {
        var text = "";
        if ( spec ) {
            text = spec.description;
            var parent = spec.suite;
            while( parent ) {
                text = parent.description + " " + text;
                parent = parent.parentSuite;
            }
        }
        return text;
    };

    var link = function( spec, text ) {
        var href = "?";
        var suite = purl.param("suite");
        href += "suite=" + suite + "&";
        href += "filter=" + fullDescription( spec );
        var t = text || fullDescription(spec);

        return $("<a />", { text: t, 
                            href: href } );
    };
    
    return {
        brief:briefDescription,
        full:fullDescription,
        link:link
    };
    
} );
