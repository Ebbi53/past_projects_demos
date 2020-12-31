//subview search model
define([
    'jquery',
    'underscore',
    'backbone',    
    'moduleConfig'
], function($, _, Backbone, moduleConfig){
   var Model = Backbone.Model.extend({
        urlRoot: moduleConfig.modelBaseUrlRoot,
        
        defaults:{
            id: 0,
            name: '',
            value: '',
            type: 'text',
            searchType: '',
            containerClass: 'col-sm-3'
        }
   });
    
    return Model; 
});