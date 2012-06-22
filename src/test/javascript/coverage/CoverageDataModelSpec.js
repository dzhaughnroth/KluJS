/*global define:false, describe:false, it:false, expect:false, $$_l:false */
define( [ "coverage/CoverageDataModel", "coverage/NodeCoverageCalculator", "./fixture/trinary.js", "./fixture/simple.js", "./fixture/target.js" ], function( CoverageDataModel, NodeCoverageCalculator ) {

    describe( "CoverageDataModel", function() {
        var topic = new CoverageDataModel.ProjectModel();
        var fixtures;
        var events = [];
        topic.on( 'reset', function() { events.push( arguments ); } );
        it ( "Should be initially empty", function() {
            expect( topic.calculator).toBeUndefined();
            expect( topic.length ).toBe( 0 );
        } );
        it( "Should be a collection of SrcModels", function() {
            expect( events.length ).toBe( 0 );
            topic.setData( $$_l );            
            expect( topic.calculator.nodeCoverage).toBe( $$_l );
            expect( events.length ).toBe( 1 );
            expect( topic.length > 3 ).toBe( true );
            fixtures = topic.filter( function( item ) { 
                return item.get( "src" ).indexOf( "fixture" ) > 0; 
            } );
            expect( fixtures.length ).toBe( 3 );
            var x = fixtures[1];
            expect( x.get("calculator").nodeCoverage).toBe( $$_l );
            expect( x.data().element.missed ).toBe( 17 );
            expect( x.data().line.missed ).toBe( 4 );
        } ); 
        it( "Should be sorted by src by default", function() {
            expect( fixtures[0].get("src") ).toMatch( /simple.js$/ );
            expect( fixtures[2].get("src") ).toMatch( /trinary.js$/ );
            expect( topic.comparator( fixtures[0], fixtures[0] )).toBe( 0 );
        } );
    } );
} );
