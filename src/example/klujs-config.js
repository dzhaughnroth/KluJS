/*global klujs:true */
klujs = {
    require : {
        paths: {
            // not required by klujs; to demonstrate non-conflict
            underscore: 'lib/underscore'
        }
    },
//    suites : { 
//        "One" : [ "OneSpec.js", "AnotherOneSpec.js"],
//        "Two" : [ "TwoSpec.js" ]
//    },
    lineCoverage : {
        alert:"warn",
        max: 0,
        except: {
            generalAggro: { 
                files:["One", "Barzle"],
                max : 5,
                min : .95
            },
            integrationSuite : {
                suites: [ "integration" ],
                max : -1
            },
            mistake : {
                files: ["oozle"],
                max : 10
            }
        }
    },
    suiteLineCoverage: {
        alert:"fail", // or warn, or default none
        max:2, // or, max:{lines:2, branches 4}
        min:.9,
        except : {
            "goo" : { max: 3 }
        }
    },
    autoSuites:true,
    autoFocus:true,
    suites: {
        "One" : { 
            focus:"auto", // that is, what?
            specs:["OneSpec.js","AnotherSpec.js"] 
        },
        "Two" : {
            focus:"../foo", //that is, we cover things in foo one up
            // form the main location
            specs:["TwoSpec.js"]
        }
    },
    ignore:"me"
};


