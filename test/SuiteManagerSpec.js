var should = require('should');
describe('SuiteManager', function(){
    var fs = require('fs');
    var SuiteManager = require( '../src/main/javascript/autosuite/SuiteManager' );
    var topic = SuiteManager.create( "src/test" );
    it( "Should supply javascript model of suites", function() {
        var obj = topic.get();
        obj["javascript/lint"]
            .should.include( "javascript/lint/LintModelSpec.js" );
        obj["javascript"]
            .should.include( "javascript/SuitePageSpec.js" );
    } );
    it( "Should supply json string representation", function() {
        var o2 = JSON.parse( topic.getAsString() );
        o2["javascript/lint"]
            .should.include( "javascript/lint/LintModelSpec.js" );
        o2["javascript"]
            .should.include( "javascript/SuitePageSpec.js" );    
    } );

});
