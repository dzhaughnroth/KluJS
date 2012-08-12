/*global klujs:true */
klujs = {
    libDirs: ["src/main/js/lib", "src/test/js/lib"],
//              "src/node", "src/example" ],
    deadCode: [ "/src/main/js/SuiteBoot.js",
                "/src/main/js/multi/MultiBoot.js"],
    elementCoverage : {
        max : 0,
        except : {
            ccWeird: {
                // Code for checking for 
                // cc's existence is maybe overcautious here.
                files : [ "NodeCoverageCalculator" ],
                max : 1
            },
            // The global $$_l is never undefined in testing;
            coverageGlobalAccessor : {
                files : [ "suite/SuiteAssembly.js" ],
                max : 2
            },
            // a hasOwnProperty is never false
            suiteManagerHasOwnPropertyForLoop : {
                files : [ "autosuite/SuiteManager.js" ], 
                max : 2
            }
        }
    },
    ignore:"me"
};


