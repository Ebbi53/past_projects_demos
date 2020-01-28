// subview
define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    './../subview/view',
    './model',
    'text!./tmpl_view.html'
], function($, _, Backbone, bootstrap, Subview, Model, tmpl){
   var FormFieldView = Subview.extend({
        tagName: 'div',
        className: 'subview form-group form_field',
        defaultClassNameFromModel: 'col-sm-3',
        
        currentTmpl: tmpl,
        isSearch: true,
        
        initialize: function(options){
            var that = this;
			
			this.isSearch = this.options.isSearch || true;
			
			Subview.prototype.initialize.apply(this);
			
        },
        
        
        setupEventListeners: function(){
            var that = this;
        },
        
        events:{
            'change [control]': 'updateModel',
            'change [search_typel]': 'updateModel',
            'mouseup': 'updateModel',
            'touchend': 'updateModel',
            'keyup': 'updateModel'
        },
        
        render: function(){
            this.$el.attr('class', this.className);
            this.$el.addClass(this.model.get('containerClass') || this.defaultClassNameFromModel);
            this.$el.html(_.template(this.currentTmpl, _.extend(this.model.toJSON(), {isSearch: this.isSearch})));
        },
        
        updateModel: function(){
            this.model.set('value', this.val());
            this.model.set('searchType', this.$('[search_type]').val());
        },
        
        val: function(){
            var $control = this.$('[control]').first(),
                $subControl = $control.children();
            if ($subControl.length > 0){
                return $control.find('*:checked').val();
            }
            
            return $control.val();
        },
        
        getSearchType: function(){
            return this.model.get('searchType');
        }
    });
    
    return FormFieldView; 
});











