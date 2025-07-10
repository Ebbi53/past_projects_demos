// subview
define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    './model',
    'text!./tmpl_view.html'
], function($, _, Backbone, bootstrap, Model, tmpl){
   var Subview = Backbone.View.extend({
        tagName: 'div',
        className: 'subview',
        
        currentTmpl: tmpl,
        
        initialize: function(options){
			this.vent = this.options.vent || _.extend({}, Backbone.Events);
			this.model = this.model || new Model(this.options.modelJSON || null);
			this.model.view = this;
            this.setupEventListeners();
            
            this.render= _.wrap(this.render, function(func){
                this.trigger('renderStart', {target: this});
                func.apply(this);
                this.$('.btn').button();
                this.trigger('renderComplete', {target: this});
            });
            
            this.render();
            
            this.vent.trigger('viewInitialized', {target: this});
            this.model.trigger('viewAttached', {target: this.model});
        },
        
        
        setupEventListeners: function(){
            var that = this;
        },
        
        events:{
        },
        
        render: function(){
            this.$el.html(_.template(this.currentTmpl)( this.model.toJSON()));
        }
        
    });
    
    return Subview; 
});