klujs = {
    src : "example",
    main : "example/main",
    test : "example/test",
    libDirs : [ "example/test/lib", "example/main/lib", "KluJS", "example/test/rlib" ],
    requireHome : "example/test/rlib",
    suites : {
        specSuite : [ "subgloof/SubSomeSpec.js" ]
    },
    specRunners: [ "example/test/GloofSpecRunner.html" ],
    foo:"bar"
};