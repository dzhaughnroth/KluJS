/*global define:false, describe:false, it:false, expect:false, beforeEach:false, runs:false, waitsFor:false, klujs:false */
define( [ "autosuite/AutoSuiteFetcher", "ConfigFacade"], function( Fetcher, ConfigFacade ) {

    describe( "AutoSuiteFetcher", function() {
        var mock = new ConfigFacade( { autoSuites:true } );
        var topic = new Fetcher( mock, "src/test/javascript/autosuite/mockResult.json");
        var recd = 0,
            errs = 0;
        var callback = function() {
            recd++;
        };
        var errorCallback = function() {            
            errs++;
        };
        beforeEach( function() {
            recd = 0;
            errs = 0;
        } );
        it( "Does nothing but callsback if autoSuites is falsy", function() {
            var nonconfig = new ConfigFacade({});
            var topic2 = new Fetcher( nonconfig, "whatever" );
            topic2.fetch( callback, errorCallback );
            expect( recd ).toBe( 1 );
            expect( nonconfig.rawConfig ).toEqual( {} );
        } );

        it( "Fetches asynchonously from supplied src", function() {
            runs( function() { 
                topic.fetch( callback, errorCallback );
                expect( recd ).toBe( 0 );
                expect( mock.suites ).toBeUndefined();
            } );
            waitsFor( function() {
                return recd > 0;
            }, 1000 );
            runs( function() {
                expect( recd ).toBe( 1 );
                expect( errs ).toBe( 0 );
                expect( mock.suiteNames() ).toEqual( ["foo"] );
                expect( mock.specsForSuite("foo") ).toEqual( ["bar"] );
            } );                 
        } );
        it( "Handles errors", function() {
            var altTopic = new Fetcher( mock, "src/test/javascript/autosuite/mockErrorResult.json" );
            runs( function() {
                altTopic.fetch( callback, errorCallback );
            } );
            waitsFor( function() { return errs > 0; }, 1000 );
            runs( function() {
                expect( errs ).toBe( 1 );
                expect( recd ).toBe( 0 );
            } );            
        } );
        it( "Is configured by default", function() {
            var x = new Fetcher();
            expect( x.src ).toBe( "klujs-autoSuites.json" );
        } );
    } );
} );
