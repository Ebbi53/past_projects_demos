//subview model
define([
    'jquery',
    'underscore',
    'backbone',    
], function($, _, Backbone){
   var Model = Backbone.Model.extend({
       urlRoot: '',
       defaults:{

       }
   });
    
    return Model; 
});