(function() {
    var rootpath = "../../../test/javascript/";
    rootpath = "";
    jasmineGradle.add( rootpath + "SpecRunner.html" );
    jasmineGradle.add( rootpath + "RealSpecRunner.html" );
    jasmineGradle.add( rootpath + "RunnerSpecRunner.html" );
//    jasmineGradle.add( "GenericSpecRunner.html?suite=specSuite.js" );
//    jasmineGradle.add( rootpath + "VooDooSpecRunner.html?suite=runnerSuite.js" );
//    jasmineGradle.add( rootpath + "VooDooSpecRunner.html?suite=lintjobSuite.js" );
    jasmineGradle.add( rootpath + "Genero.html?suite=specSuite.js" );
    jasmineGradle.add( rootpath + "Genero.html?suite=runnerSuite.js" );
    jasmineGradle.add( rootpath + "Genero.html?suite=lintjobSuite.js" );
})();