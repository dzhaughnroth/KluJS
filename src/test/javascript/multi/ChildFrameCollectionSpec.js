/*global define:false, describe:false, it:false, expect:false, jasmine:false */
define( [ "multi/ChildFrameCollection", "jquery", "lib/notUnderscore" ], function( Cfc, $, _ ) {

    describe( "ChildFrameCollectionView and SummaryView", function() {
        var model = new Cfc.Model();
        var compositeView = new Cfc.CompositeView( { model:model } ).render();
        var tableView = compositeView.tableView;
        var summary = compositeView.summaryView;
//        $("body").append( compositeView.$el );
        it( "Compsite view consists of summary and table views", function() {
            expect( $(compositeView.$el.children()[0]) ).toEqual( summary.$el );
            expect( $(compositeView.$el.children()[1]) ).toEqual( tableView.$el );
        } );
        it( "Collection is initially empty", function() {
            expect( model.length ).toBe( 0 );            
            expect( model.isDone() ).toBe( true );
            expect( model.isFailing() ).toBe( false );
        } );
        it ( "TableView start as an empty table", function() {
            expect( tableView.$el.is( "table" ) ).toBe( true );
            expect( tableView.$el.find( "th" ).length ).toBe( 3 );
            expect( tableView.$el.find( "thead tr" ).length ).toBe( 1 );
            expect( tableView.$el.find( "td" ).length ).toBe( 0 );
            expect( tableView.$el.find( "tbody tr" ).length ).toBe( 0 );
        } );
        it( "SummaryView is a div", function() {
            expect( summary.$el.is( "div" ) ).toBe( true );
            expect( summary.$el.text()).toBe( "0 of 0 suites failed (0 running)" );
            expect( summary.$el.hasClass( "running" ) ).toBe( true );
        } );
        it( "TableView should get rows for new child frames", function() {
            model.add( { suite: "foo" } );
            expect( model.length ).toBe( 1 );
            expect( model.isDone() ).toBe( false );
            expect( model.isFailing() ).toBe( false );
            expect( tableView.$el.find( "tbody tr" ).length ).toBe( 1 );
            model.add( { suite: "bar" } );
            expect( model.length ).toBe( 2 );
            var found = tableView.$el.find( "tbody tr" );
            expect( found.length ).toBe( 2 );
            expect( $(found[0]).children(":first").text() ).toBe( "foo" );
            expect( $(found[1]).children(":first").text() ).toBe( "bar" );
        } );
        it( "Summary counts should be updated", function() {
            expect( summary.$el.text()).toBe( "0 of 2 suites failed (2 running)" );
            expect( summary.$el.hasClass( "running" ) ).toBe( true );            
            expect( summary.$el.hasClass( "failed" ) ).toBe( false );
        } );
        it( "Should keep a table of ChildFrameManagerViews", function() {
            expect( tableView.subviews.foo.$el.is( "tr" ) ).toBe( true );
        } );
        it( "Let ChildFrameManagerViews update themselves", function() {
            var found = tableView.$el.find( "tbody tr" );
            expect( $(found[0]).children(":nth-child(2)").text() ).toBe( "...Running..." );
            model.at( 0 ).set( "results", { failedCount: 3, count: 5, passedCount: 2 } );
            model.at( 0 ).set( "status", "failed" );
            model.at( 0 ).set( "coverageGoalFailures", 173 );
            expect( model.isDone() ).toBe( false );
            expect( model.isFailing() ).toBe( true );
            found = tableView.$el.find( "tbody tr" );
            expect( $(found[0]).children(":nth-child(2)").text() ).toMatch( "Failed 3 of 5 specs" );
            expect( $(found[0]).children(":nth-child(3)").text() ).toMatch( "173" );
            
        } );        
        it( "Summary counts should again be updated", function() {
            expect( summary.$el.text()).toBe( "1 of 2 suites failed (1 running)" );
            expect( summary.$el.hasClass( "running" ) ).toBe( true );
            expect( summary.$el.hasClass( "failed" ) ).toBe( true );
        } );
        it( "Records finished", function() {
            model.at( 1 ).set( "results", { failedCount: 0, count: 5, passedCount: 5 } );
            model.at( 1 ).set( "status", "passed" );
            expect( model.isDone() ).toBe( true );
            expect( model.isFailing() ).toBe( true );
            expect( summary.$el.hasClass( "running" ) ).toBe( false );
            expect( summary.$el.hasClass( "failed" ) ).toBe( true );
            model.at( 0 ).set( "results", { failedCount: 0, count: 5, passedCount: 5 } );
            model.at( 0 ).set( "status", "passed" );
            expect( model.isDone() ).toBe( true );
            expect( model.isFailing() ).toBe( false );
            expect( summary.$el.hasClass( "running" ) ).toBe( false );
            expect( summary.$el.hasClass( "failed" ) ).toBe( false );
        } );
        it( "Produces summary", function() {
            var summary = model.summarize();
            expect( _.keys( summary )).toEqual( ["foo", "bar"] );
            expect( summary.foo ).toEqual( { status:"passed", coverageGoalFailures:173} );
        } );


    } );
    

} );
