var should = require('should');

describe('SpecFinder', function(){
    var fs = require('fs');
    var Finder = require( '../src/main/javascript/autosuite/SpecFinder' ).SpecFinder;
    var topic = new Finder( "src/test" );
    describe('Should exist', function(){
        topic.find();
        it('should have directories for keys', function(){
            // don't be misled;
            // normally, we'd use new Finder("src/test/javascript")
            should.exist( topic.suites["javascript/lint"] );
            topic.suites["javascript/lint"].length.should.be.above(3);
            topic.suites["javascript/lint"].length.should.be.below(10);
            topic.suites["javascript/lint"].should.include( "javascript/lint/LintModelSpec.js" );
            topic.suites["javascript"].should.include( "javascript/SuitePageSpec.js" );
        });
    });
});
