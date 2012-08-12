/*global JSON:false, define:false, $$_l:false, describe:false, it:false, expect:false */
define( [ "coverage/NodeCoverageCalculator", "./fixture/simple.js", "./fixture/target.js", "./fixture/trinary.js" ], function( NCC, a, b, c ) {
    describe( "Coverage Calculator", function() {
        var q = $$_l;
        var calc = new NCC( $$_l );
        it( "Calculates coverage", function() {
            var target = "/src/test/js/coverage/fixture/target.js";
            var x = calc.coverageByFile[target];
            var lines = 39;
            var linesWithConditions = 7; // manually count
            var missedLines = 4;
            var conditions = 15;
            var branches = 30;
            var missedBranches = 14;
            // a lineWithCondition is counted extra with branches.
            var elements = lines + branches - linesWithConditions; 

            // The extra 1 is a missed line with 2 (missed) branches
            // That is 2 missed branches, 1 missed line, 2 missed elements
            var missedElements = missedLines + missedBranches - 1;

            expect( q.lines[target].length ).toBe(lines);
            expect( q.allConditions[target].length ).toBe(conditions);
            expect( x.line.count ).toBe( lines );
            expect( x.line.missed ).toBe( missedLines );
            expect( x.line.rate ).toBe( 1 - missedLines/lines );
            expect( x.element.count ).toBe( elements );
            expect( x.element.missed ).toBe( missedElements );
            expect( x.line.firstLine ).toBe( 18 );
            expect( x.line.lastLine ).toBe( 49 );
            expect( x.element.firstLine ).toBe( 18 );
            expect( x.element.lastLine ).toBe( 51 );
        } );
        it( "Fudges trinary operators", function() {
            var x = calc.coverageByFile["/src/test/js/coverage/fixture/trinary.js"];
            expect( x.line.count ).toBe( 6 );
            expect( x.line.missed ).toBe( 0 );
            expect( x.branch.count ).toBe( 8 );
            expect( x.branch.missed ).toBe( 5 );
            // 6 lines + 8 branches - 2 lines with branches
            expect( x.element.count ).toBe( 6 + 8 - 2);
            expect( x.element.missed ).toBe( 5 ); // the missed branches are on "unlines"

            expect( x.line.firstLine ).toBeUndefined();
            expect( x.line.lastLine ).toBeUndefined();
            expect( x.element.firstLine ).toBe(2);
            expect( x.element.lastLine ).toBe(2);
        } );
        it( "Deals with simple files", function() {
            var x = calc.coverageByFile[ "/src/test/js/coverage/fixture/simple.js" ];
            expect( x.line.count ).toBe( 2 );
            expect( x.line.rate ).toBe( 1 );
            expect( x.branch.count ).toBe( 0 );
            // this is the main point: tests the defineGetter code I hope
            expect( x.branch.rate ).toBe( 0 );
            expect( x.element.count ).toBe( 2 );
            expect( x.element.rate ).toBe( 1 );
        } );

    } );
} );