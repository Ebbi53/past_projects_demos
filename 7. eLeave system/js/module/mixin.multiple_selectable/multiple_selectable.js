// mixin
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    var MixinMultipleSelectable = {
        
        // share acorss objects
        multipleSelectObjectShareData:{
            selectedObjects: Array(),
            selectableObjects: Array(),
            eventEmitter: _.extend({}, Backbone.Events)
        },
        
        init: function(options){
            this.multipleSelectObjectData = {
                isMultipleSelectable: true
            };
            
            if (typeof options.isMultipleSelectable != 'undefined')
                this.multipleSelectObjectData.isMultipleSelectable = options.isMultipleSelectable;
                
            this.$el.addClass('multipleSelectable');
            this.multipleSelectObjectShareData.selectableObjects.push(this);
            
            var that = this;
            this.$el.on('click', function(event){
                var selectedObjects = that.multipleSelectObjectShareData.selectedObjects,
                    isSelected = _.find(selectedObjects, function(obj){return obj.cid == that.cid}),
                    hasCtrlKey = event.ctrlKey;
                if (hasCtrlKey){
                    if (isSelected)
                        that.onDeselect.apply(that, [event]);
                    else
                        that.onSelect.apply(that, [event]);
                }
            });
            
            $(document).on('click', function(event){
                if (event.ctrlKey) return ;
                
                var $element = $(event.srcElement || event.target).closest('.multipleSelectable.selected');
                if ($element.length === 0){
                    that.onDeselect.apply(that, [event]);
                }
            });
            
            this.$el.on('dragstart', function(event, data){
                var orgEvent = data.event,
                    isTargetView = orgEvent.isMultipleSelectTargetView;
                if (isTargetView !== false){
                    orgEvent.isMultipleSelectTargetView = false;
                    var selectedObjects = 
                        _.filter(that.multipleSelectObjectShareData.selectedObjects, function(obj){
                            return obj.cid != that.cid;
                        });
                    _.each(selectedObjects, function(obj){
                        obj.onDrag(orgEvent);
                    });
                }
            });
            
        },
        
        onSelect: function(){
            if (!this.multipleSelectObjectData.isMultipleSelectable) return;
            
            this.$el.addClass('selected');
            this.multipleSelectObjectShareData.selectedObjects.push(this);
            
            this.$el.trigger('select', {target: this});
            this.multipleSelectObjectShareData.eventEmitter.trigger('select', {target: this});
        },
        
        onDeselect: function(){
            this.$el.removeClass('selected');
            var that = this;
            this.multipleSelectObjectShareData.selectedObjects = 
                _.filter(this.multipleSelectObjectShareData.selectedObjects, function(obj){
                    return obj.cid != that.cid;
                });
            
            this.$el.trigger('deselect', {target: this});
            this.multipleSelectObjectShareData.eventEmitter.trigger('deselect', {target: this});
        }
        
    };
    
    return MixinMultipleSelectable; 
});