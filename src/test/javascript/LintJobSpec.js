/*globals define:false, describe:false, it:false, expect:false */
define( ["KluJS/lintJob", "jquery"], function( ljMod, $ ) {
    describe( "The LintJob Module's ", function() {
        describe( "LintJob class", function() {
            describe( "Initially", function() {
                var lj = new ljMod.LintJob( );
                it( "Should not be done", function() {
                    expect( lj.done ).toBe( false );
                });
                it( "Should be blank", function() {
                    expect( lj.lintData ).toBeUndefined();
                    expect( lj.message ).toBeUndefined();
                    expect( lj.error ).toBeUndefined();
                } );
            } );
            describe( "When succeeding", function() {
                var mockData = { errors : ["foo", "bar"]};
                var lj = new ljMod.LintJob();
                lj.succeed( mockData );
                it( "Should be populated", function() {
                    expect( lj.done ).toBe( true );
                    expect( lj.error ).toBe( false );
                    expect( lj.lintData ).toBe( mockData );                    
                    expect( lj.issueCount() ).toBe( 2 );
                } );
            } );
            describe( "When failed", function() {
                var mockData = {};
                var message = "msg";
                var lj = new ljMod.LintJob();
                lj.fail( message, mockData );
                it( "Should have partialData and message", function() {
                    expect( lj.done ).toBe( true );
                    expect( lj.error ).toBe( true );
                    expect( lj.lintData ).toBe( mockData );
                    expect( lj.message ).toBe( message );
                } );
            } );
            describe( "When processing", function() {
                var lj = new ljMod.LintJob();
                it( "Should process decent scripts", function() {
                    var script = [ "myglobal = 13;", 
                                   "var cute = 'cute';",
                                   "for( var i = 0; i < 13; i++ ) {",
                                   "  cute += '.';",
                                   "}" ]
                            .join( "\n" );
                    lj.process( script );
                    expect( lj.done ).toBe( true );
                    expect( lj.issueCount() ).toBe( 4 );
                    expect( lj.error ).toBe( false );
                    expect( lj.lintData ).toBeDefined();
                } );                
                it( "Should parse bad scripts", function() {
                    var script = "for( var i = 0; i < 13; i++ {\n  cute += '.';\n}\n";
                    lj.process( script );
                    expect( lj.done ).toBe( true );
                    expect( lj.issueCount() > 2 );
                } );
                it( "Should handle unused variable", function() {
                    var script = "function() { var j = 0; return 3; };";
                    lj.process( script );
                    expect( lj.issueCount() ).toBe( 3 );
                } );
                it( "Should report errors", function() {
                    lj.process( null );
                    expect( lj.done ).toBe( true );
                    expect( lj.error ).toBe( true );
                    expect( lj.message.match( /^JSLint failed/ ));
                } );                
            } );
            describe( "When lacking data", function() {
                var lj = new ljMod.LintJob();
                it ( "Should not report false issue counts", function() {
                    expect( function() { lj.issueCount(); } ).toThrow( "No JSLINT data" );
                    
                } );
            } );
            
        });
        describe( "LintJobFactory class", function() {
            var viewUpdateCalls = [];
            var mockView = function( viewId ) {
                return { 
                    update : function( lintJob ) {
                        viewUpdateCalls.push( viewId + ":" + lintJob.id );
                    }
                };
            };
            var view1 = mockView(1),
                view2 = mockView(2),
                ljf = new ljMod.LintJobFactory( );
            ljf.addListener( { created: function(job) {
                job.listeners.push( view1 );
                job.listeners.push( view2 );
            } } );
            it( "Should track jobs by Id", function() {
                var ljs = [ ljf.create( "a", 17 ),
                            ljf.create( 2, 17 ) ],
                    i;
                for( i = 0 ;i < ljs.length; i++ ) {
                    var lj = ljs[i];
                    expect( ljf.lintJobs[ lj.id ] ).toBe( lj );
                    expect( ljf.jobsInProgress[lj.id] ).toBeDefined();
                    expect( ljf.jobsCompleted[lj.id] ).toBeUndefined();
                }
            } );
            it( "Should update create/complete listeners", function() {
                var lja = ljf.create( 13, 17 );
                expect( lja.listeners.length ).toBe( 3 );
                var mockData = {};
                lja.succeed( mockData );
                expect( ljf.jobsInProgress[ lja.id ] ).toBe( undefined);
                expect( ljf.jobsCompleted[ lja.id ] ).toBe( lja );
                expect( viewUpdateCalls ).toEqual( ["1:13","2:13"] );
                expect( ljf.isDone() ).toBe( false );
                var mockData2 = {};
                var ljb = ljf.create( 14, 18 );
                ljb.fail( mockData2 );
                expect( viewUpdateCalls ).toEqual( ["1:13", "2:13", "1:14", "2:14"] );
                expect( ljf.jobsInProgress[ ljb.id ] ).toBe( undefined);
                expect( ljf.jobsCompleted[ ljb.id ] ).toBe( ljb );
            } );
        } );
   } );
});