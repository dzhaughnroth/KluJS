/*globals define:false, jasmine:false, apiReporter:true, lintReporter:true, 
 require:false, $:false, klujs:false */
define( [ "./lib/order!./lib/jasmine",
    "./lib/order!./lib/jasmine-html",
    "./lib/order!./jasmine-lintReporter", 
    "./lib/order!./jasmine-parentReporter",
    "./lib/order!./jasmine-coverageReporter",
    "./lib/purl",
    "require"
  ], 
  function( xj, xjhtml, duhLintReporter, parentReporter, coverageReporter, purl, req ) {
      apiReporter = new jasmine.JsApiReporter();
      lintReporter = duhLintReporter;
      jasmine.getEnv().addReporter( apiReporter );
//      jasmine.getEnv().addReporter( new jasmine.TrivialReporter() );
      jasmine.getEnv().addReporter( new jasmine.HtmlReporter() );
      jasmine.getEnv().addReporter( coverageReporter );
      jasmine.getEnv().addReporter( lintReporter );
      jasmine.getEnv().addReporter( parentReporter );
      
      var run = function( specs ) {
          req( specs, function() {
              $("body").ready( function() { jasmine.getEnv().execute(); } );
          } );
      };
                
      var pretend = function() {
          $("body").ready( function() {
              var suite = purl().param("suite");
              var relSpecs = [];
              $.each( klujs.suites[suite], function( i, spec ) {
                  relSpecs.push( "../" + klujs.test + "/" + spec );
              });
              run( relSpecs );
          } );
      };

      return { run : run,
               pretend: pretend };
  } );

        
      


