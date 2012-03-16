/*global define:false, jasmine:false, window:false */

define( ["jquery", "./coverageView", 
         "./urlUtil", "./lib/jasmine"], function( $, coverageView, urlParser ) {
    var result = new jasmine.Reporter();

    result.reportRunnerResults = function( ) {
        coverageView.showCoverage( );
    };
    return result;
} );
