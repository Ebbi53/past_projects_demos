// Mixin factory
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    var MixinFactory = {
        // define attribute mixins as an array
        
        // call this function to init all mixin in async manner
        initMixins: function(Obj, args){
            if (!this.mixins) return;
            var that = this;
            
            _.each(this.mixins, function(mixinName){
                require([
                    'module/mixin.' + mixinName + '/' + mixinName
                ], function(Mixin){
                    _.extend(Obj.prototype, Mixin);
                    Mixin.init.apply(that, _.clone(args));
                });
            });
        }
    };
    
    return MixinFactory; 
});