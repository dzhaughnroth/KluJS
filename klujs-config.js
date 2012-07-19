/*global klujs:true */
klujs = {
    require : {
        paths: {
        }
    },
    autoSuites:true,    
    elementCoverage : {
        max : 0,
        except : {
            ccWeird: {
                // Overcaution in checking for cc's existence.
                files:[ "NodeCoverageCalculator" ],
                max : 1
            },
            pageGlobal: {
                // setting the klujsAssembly global will never work in a unit test.
                files:[ "SuitePage" ],
                max : 2
            }
        }
    },
    ignore:"me"
};


