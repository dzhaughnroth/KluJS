/*global klujs:true */
klujs = {
    autoSuites:true,    
    libDirs: ["src/main/javascript/lib", "src/test/javascript/lib",
              "src/aux", "src/example" ],
    elementCoverage : {
        max : 0,
        except : {
            ccWeird: {
                // Code for checking for 
                // cc's existence is maybe overcautious here.
                files:[ "NodeCoverageCalculator" ],
                max : 1
            },
            pageGlobal: {
                // setting the klujsAssembly global 
                // will never work in a unit test.
                files:[ "SuitePage" ],
                max : 2
            }
        }
    },
    ignore:"me"
};


