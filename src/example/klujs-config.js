/*global klujs:true */
klujs = {
    require : {
        paths: {
            underscore: 'lib/underscore',
            backbone: '../../../KluJS/javascript/lib/backbone',
            jslint: '../../../KluJS/javascript/lib/webjslint'
        }
    },
    suites : { 
        "One" : [ "OneSpec.js", "AnotherOneSpec.js"],
        "Two" : [ "TwoSpec.js" ]
    },
    ignore:"me"
};


