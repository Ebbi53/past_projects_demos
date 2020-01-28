// mixin
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    var Mixin = {
        
        init: function(){
        },
        
        extend: function(obj){
            return _.extend(Mixin, obj);
        }
    };
    
    return Mixin; 
});