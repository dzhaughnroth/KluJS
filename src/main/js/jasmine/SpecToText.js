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
    var fullDescription = function(specOrSuite) {
        var text = "";
        if ( specOrSuite ) {
            text = specOrSuite.description;
            var parent = specOrSuite.suite || specOrSuite.parentSuite;
            while( parent ) {
                text = parent.description + " " + text;
                parent = parent.parentSuite;
            }
        }
        return text;
    };

    var link = function( specOrSuite, text ) {
        var href = "?";
        var suite = purl.param("suite");
        href += "suite=" + suite + "&";
        href += "filter=" + fullDescription( specOrSuite );
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
