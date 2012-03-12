/*globals define:false, jasmine:false, apiReporter:true, lintReporter:true, 
 require:false, $:false, klujsConfig:false */
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
      jasmine.getEnv().addReporter( new jasmine.TrivialReporter() );
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
              $.each( klujsConfig.suites[suite], function( i, spec ) {
                  // FIXME html serves as test home, compute a relative url
                  // Somehow this works.
                  // This is how: KluJS is one deep from root. So we go up one and 
                  // are using an absolute path. So that gets us to the webpages directory.
                  relSpecs.push( "../" + spec );
//                  relSpecs.push( spec );
              });
              run( relSpecs );
          } );         
      };

      return { run : run,
               pretend: pretend };
  } );

        
      


