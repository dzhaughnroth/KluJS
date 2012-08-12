/*globals define:false, klujs:false*/
define( ["./ConfigFacade"], function( ConfigFacade ) {
    var globalConfig = new ConfigFacade( klujs );
    return globalConfig;
} );
