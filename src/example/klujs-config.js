/*global klujs:true */
klujs = {
    require : {
        paths: {
            // not required by klujs; to demonstrate non-conflict
            underscore: 'lib/underscore'
        }
    },
    suites : { 
        "One" : [ "OneSpec.js", "AnotherOneSpec.js"],
        "Two" : [ "TwoSpec.js" ]
    },
    ignore:"me"
};


