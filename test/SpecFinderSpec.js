var should = require('should');

describe('SpecFinder', function(){
    var fs = require('fs');
    var Finder = require( '../src/main/javascript/autosuite/SpecFinder' ).SpecFinder;
    describe('Should deal with empty directories at top', function(){
        var topic = new Finder( "src/test" );
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
    describe('Should deal with specs in the base directory', function() {
        var topic = new Finder( "src/test/javascript" );        
        topic.find();
        it('should have special (base) key', function() {
            var base = topic.suites["(base)"];
            base.length.should.be.above( 2 );
            base.length.should.be.below(10);
            base.should.include( "SuitePageSpec.js" );
        } );
    } );
});
