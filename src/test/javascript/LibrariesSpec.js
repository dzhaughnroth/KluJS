/*global define:false, describe:false, it:false, expect:false, $:false, Backbone:false, _:false */
define( [ "notJQuery", "notBackbone", "notUnderscore" ], function( x$, xBb, x_ ) {
    describe( "The notJQuery library", function() {
        it( "Should not be $", function() {
            expect( typeof $ ).toBe( "undefined" );
            expect( x$ ).toBeDefined();
//            expect( x$ !== $ ).toBe( true );
        } );
        it( "Should have datatable plugin loaded", function() {
            expect( x$("<table />").dataTable ).toBeDefined();
        } );
    } );
    describe( "The notBackbone library", function() {
        it( "Should use noConflict mode", function() {
            expect( typeof Backbone ).toBe( "undefined" );
            expect( xBb.Model ).toBeDefined();        
        } );
    } );
    describe( "The notUnderscore library", function() {
        it( "Should use noConflict mode", function() {
            expect( typeof _ ).toBe( "undefined" );
            expect( x_.map ).toBeDefined();
        } );
        it( "Should correct for a certain phantomjs bug", function() {
            // this checks that we do not over correct.
            var BadType = function(prop,val) {
                this.foo = "bar";
                this.__defineGetter__(prop, function() {
                    return val;
                } );
                this.__defineSetter__(prop, function() {
                    throw "no";
                } );
            };
            // This case occurs with phantomjs
            var q = x_.extend( new BadType( "-1", undefined ), { baz:"oop", "-1":null } );
            expect( q.foo ).toBe( "bar" );
            expect( q.baz ).toBe( "oop" );
            expect( q["-1"] ).toBeUndefined();
            // Here, we test code to check we do not trap unexpected errors
            try {
                x_.extend( new BadType("-1", "a"), { baz:"oop", "-1":"b"} );
                expect( 21 ).toBe( 33 );
            }
            catch( ex1 ) {
                expect( ex1 ).toEqual( "no" );
            }

            try {
                x_.extend( new BadType( "a", undefined ), { baz:"oop", "a":"b" } );
                expect(71).toBe( 99 );
            }
            catch( ex2 ) {
                expect( ex2 ).toEqual( "no" );
            }


        } );
    } );
} );
