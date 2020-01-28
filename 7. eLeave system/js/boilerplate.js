// boilerplate code for module using require.js
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
   var View = Backbone.View.extend({
        tagName: 'div',
        className: '',
        
        currentTmpl: '',
        viewTmpl: '',
        editTmpl:'',
        
        initialize: function(){
			this.vent = this.options.vent || _.extend({}, Backbone.Events);
			this.currentTmpl = this.viewTmpl;
            this.setupEventListeners();
        },
        
        setupView: function(){
        },
        
        
        setupEventListeners: function(){
            var that = this;
        },
        
        events:function(){
            return _.extend({
            }, this.specificEvents);
        },
        
        // child view's events
        specificEvents: {}
        
    });
    return View; 
});