var fs = require('fs');
var wrench = require( './wrench.js' );
var util = require( "util" );
var spawn = require( "child_process" ).spawn;
var createDir = function( name ) {
    wrench.rmdirSyncRecursive( "working", true );
    wrench.rmdirSyncRecursive( "results", true );
    fs.mkdirSync( "results" );
    wrench.copyDirSyncRecursive( "base", "working" );    
    process.chdir( "working" );
};

var execNextExample = function() {
    if ( examples.length > 0 ) {
        executeExample( examples.shift() );
    }
    else {
        util.log( "Executed all!" );
    }
};

var executeExample = function( config ) {
    var name = config.name;
    config.prep();
    fs.writeFileSync( "klujs-config.js", "/*global klujs:true */\nklujs = " + JSON.stringify( config.klujs ) + ";\n" );        
    var cp = spawn( "klujs-server", ["--phantom", "--port", "7011" ] );
    var logFd = fs.createWriteStream( "log.txt" );
    cp.stdout.on( 'data', function( data ) { logFd.write(data); } );
    cp.stderr.on( 'data', function( data ) { logFd.write(data); } );
    cp.on( 'exit', function( code ) {
        util.log( name + " finished with " + code );
        logFd.end();
        logFd.destroySoon();
        wrench.copyDirSyncRecursive( process.cwd(), "../results/" + name );
        var sumText = fs.readFileSync( "phantom-klujs-summary.json" );
        var sum = JSON.parse( sumText );
        var resText = fs.readFileSync( "phantom-klujs-result.json" );
        var res = JSON.parse( sumText );
        var passed = config.check( sum, res );
        if ( passed ) {
            execNextExample();
        }
        else {
            util.log( name + " failed; stopping." );
        }
    } );
    // and start phantom and wait and check


};

var rm = function( name ) {
    fs.unlink( name );
};

var mv = function( from, to ) {
    fs.renameSync( from, to );
};

var examples = [ 
    { name: "lintFail",
      prep : function() {},
      klujs : { elementCoverage : { max : 0 } },
      check : function( summary, result ) { 
          return !summary.allLintPassed 
              && summary.allTestsPassed && summary.allCoverageOk && summary.allDeadCodeOk; 
      }
    },
    { name : "straightPass",      
      prep : function() {
          rm( "src/test/js/lint/LintSpec.js" );
      },
      klujs : { elementCoverage : { max : 0 } },
      check : function( summary, result ) {
          return summary.allLintPassed && summary.allTestsPassed 
              && summary.allCoverageOk && summary.allDeadCodeOk; 
      }
    },
    { name: "elementCovFail",
      prep: function() {
          mv( "src/test/js/cov/UncoveredTwoSpec.js", "src/test/js/fine/UncoveredTwoSpec.js" );
      },
      klujs : { elementCoverage : { max : 0 } },
      check : function( summary, reslt ) {
          return summary.allLintPassed && summary.allTestsPassed 
              && !summary.allCoverageOk && summary.allDeadCodeOk; 
      }
    },
    { name : "lineCovPass",
      prep: function() {},
      klujs: { lineCoverage : { max : 0 } },
      check : function( summary, result ) {
          return summary.allLintPassed && summary.allTestsPassed 
              && summary.allCoverageOk && summary.allDeadCodeOk; 
      }
    },
    { name : "elementCovPass",
      prep: function() {},
      klujs: { elementCoverage : { max : 0, except: { one : { files : ["Uncovered.js"], max : 1 } } } },
      check : function( summary, result ) {
          return summary.allLintPassed && summary.allTestsPassed 
              && summary.allCoverageOk && summary.allDeadCodeOk; 
      }
    },
    { name : "deadCodeFail",
      prep: function() {
          mv( "src/test/js/cov/UncoveredSpec.js", "src/test/js/fine/UncoveredSpec.js" );
      },
      klujs: { lineCoverage : { max : 0 } },
      check : function( summary, result ) {
          return summary.allLintPassed && summary.allTestsPassed 
              && summary.allCoverageOk && !summary.allDeadCodeOk; 
      }
    },
    { name : "deadCodeException",
      prep: function() {
      },
      klujs: { elementCoverage : { max : 0 }, deadCode : [ "/src/main/js/cov/Uncovered.js" ] },
      check : function( summary, result ) {
          return summary.allLintPassed && summary.allTestsPassed 
              && summary.allCoverageOk && summary.allDeadCodeOk; 
      }
    },
    { name : "customSrcDirs", 
      prep: function() {
          mv( "src/main/js", "src/main/javascript" );
          mv( "src/test/js", "src/test/ickscript" );
      },
      klujs: { elementCoverage : { max : 0 }, 
               main : "src/main/javascript",
               test : "src/test/ickscript",
               deadCode : [ "/src/main/javascript/cov/Uncovered.js" ]
             },
      check : function( summary, result ) {
          return summary.allLintPassed && summary.allTestsPassed 
              && summary.allCoverageOk && summary.allDeadCodeOk; 
      }
    },
    { name : "customLibDirs", 
      prep: function() {
      },
      klujs: { elementCoverage : { max : 0 }, 
               main : "src/main/javascript",
               test : "src/test/ickscript",
               libDirs : [ "src/main/javascript/lib", 
                           "src/main/javascript/cov",
                           "src/test/ickscript/lib" ]
             },
      check : function( summary, result ) {
          return summary.allLintPassed && summary.allTestsPassed 
              && summary.allCoverageOk && summary.allDeadCodeOk; 
      }
    },
    { name : "specFail",
      prep: function() {
          mv( "src/test/ickscript/fine/FailSpec.later", "src/test/ickscript/fine/FailSpec.js" );
      },
      klujs: { elementCoverage : { max : 0 }, 
               main : "src/main/javascript",
               test : "src/test/ickscript",
               libDirs : [ "src/main/javascript/lib", 
                           "src/main/javascript/cov",
                           "src/test/ickscript/lib" ]
             },
      check : function( summary, result ) {
          return summary.allLintPassed && !summary.allTestsPassed 
              && summary.allCoverageOk && summary.allDeadCodeOk; 
      }
    }

];

createDir();
execNextExample();

