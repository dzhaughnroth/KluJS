/*globals define:false, klujs:false */
define( ["./notUnderscore", "./goals/CoverageGoalInterpreter" ], function(_,CoverageGoalInterpreter) {


    // Facade for the JSON config file.
    var ConfigFacade = function( configFromJson ) {
        var raw = configFromJson;
        this.rawConfig = raw; // testing only

        /** location of AMD loader root relative to project base */
        this.main = function() { return raw.main; };

        /** How to get there from the server home directory; i.e. prepend ../ */
        this.mainPath = function() { return raw.mainPath; };
        
        /** location of root of tests, relative to project base */
        this.test = function() { return raw.test; };

        this.autoSuites = function() {
            return typeof raw.autoSuites !== "undefined" && raw.autoSuites !== false;
        };

        this.setSuites = function( suites ) {
            raw.suites = suites;
        };

        /** Names of all suites */
        this.suiteNames = function() {
            return _.keys( raw.suites );
        };

        /** Location of specs for suite, each relative to test root */
        this.specsForSuite = function( suiteName ) {
            if ( ! raw.suites[suiteName] ) {
                return undefined;
            }
            return raw.suites[suiteName].specs || [];
        };

        this.targetsForSuite = function( suiteName ) {
            if ( ! raw.suites[suiteName] ) {
                return undefined;
            }
            return raw.suites[suiteName].targets || [];
        };

        this.libDirs = function() {
            return raw.libDirs;
        };

        this.noDefaultFilter = function() {
            return raw.noDefaultFilter;
        };

        this.lintFilter = function() { return raw.lintFilter; };

        this.lineCoverage = function() {
            return raw.lineCoverage;
        };

        this.elementCoverage = function() {
            return raw.elementCoverage;
        };

        this.deadCode = function() {
            return raw.deadCode;
        };

    };

    return ConfigFacade;

} );

        
      


