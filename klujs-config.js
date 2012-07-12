/*global klujs:true */
klujs = {
    require : {
        paths: {
        }
    },
    autoSuites:true,
    suites : { 
        "Models" : [ "JasmineModelSpec.js", "SuiteAssemblySpec.js", 
                     "SuiteViewSpec.js", "JasmineDivReporterSpec.js",
                     "SuitePageSpec.js", "SuiteRunnerSpec.js" ],
        "Lint" : [ "lint/LintModelSpec.js", 
                   "lint/LintCollectionSpec.js", 
                   "lint/LintViewSpec.js", 
                   "lint/LintCollectionSummaryViewSpec.js",
                   "lint/LintCollectionViewSpec.js",
                   "lint/DirectoryNamePrunerSpec.js",
                   "lint/LintFinderSpec.js" ],
        "Coverage" : [ "coverage/NodeCoverageCalculatorSpec.js", 
                       "coverage/CoverageDataAggregatorSpec.js",
                       "coverage/CoverageDataModelSpec.js", 
                       "coverage/CoverageDataViewSpec.js"],
        "Widgets" : [ "widgets/CheckboxSpec.js" ],
        "Multi": ["multi/ChildFrameManagerSpec.js", "multi/ChildFrameManagerViewSpec.js",
                  "multi/ChildFrameCollectionSpec.js", 
                  "multi/PageModelSpec.js", "multi/PageViewSpec.js" ],
        "AutoSuite": [ "autosuite/AutoSuiteFetcherSpec.js" ]
    },
    ignore:"me"
};


