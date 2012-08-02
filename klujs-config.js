/*global klujs:true */
klujs = {
    autoSuites:true,    
    libDirs: ["src/main/javascript/lib", "src/test/javascript/lib",
              "src/aux", "src/example" ],
    deadCode: [ "/src/main/javascript/SuiteBoot.js",
                "/src/main/javascript/multi/MultiBoot.js" ],
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
            }
        }
    },
    ignore:"me"
};


