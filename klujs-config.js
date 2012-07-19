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
            ccWierd: {
                files:[ "NodeCoverageCalculator" ],
                max : 1
            }
        }
    },
    ignore:"me"
};


