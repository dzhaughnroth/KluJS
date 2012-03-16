klujs = {
    suites : { "specSuite" : [ "SomeSpec.js", "AnotherSpec.js" ],
               "runnerSuite" : [ "ChildRunnerSpec.js" ],
               "linjobSuite" : [ "LintJobSpec.js", 
                                 "LintViewSpec.js", 
                                 "UrlUtilSpec.js" ] },
    noDefaultFilter : true,
    libDirs : [ "KluJS\/lib", /aModule\.js$/ ],
//    specRunners : [ "SpecRunner.html" ]
    "foo":"bar"
};