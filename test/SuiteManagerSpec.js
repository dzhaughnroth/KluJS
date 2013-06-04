define( ['../src/main/js/autosuite/SuiteManager.js', "should", "fs"], function( SuiteManager, should, fs ) {
    describe('SuiteManager', function(){
        //    var SuiteManager = require( '../src/main/javascript/autosuite/SuiteManager' );
        var topic = SuiteManager.create( "src/test", fs );
        it( "Should supply javascript model of suites", function() {
            var obj = topic.get();
            obj["js/lint"]
                .should.include( "js/lint/LintModelSpec.js" );
            obj["js"]
                .should.include( "js/SuitePageSpec.js" );
        } );
        it( "Should supply json string representation", function() {
            var o2 = JSON.parse( topic.getAsString() );
            o2["js/lint"]
                .should.include( "js/lint/LintModelSpec.js" );
            o2["js"]
                .should.include( "js/SuitePageSpec.js" );    
        } );
        
    });
} );
