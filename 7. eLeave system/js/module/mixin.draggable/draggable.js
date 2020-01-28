// draggable
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    var MixinDraggable = {
        
        
        init: function(options){
            this.dragObjectData = {
                isDraggable: true,
                draggingUpdateIntervalToken: null,
                thisOffset:{
                    top: 0,
                    left: 0
                },
                mouseOffset:{
                    x: 0,
                    y: 0
                },
                originalZIndex: ''
            };
            
            if (typeof options.isDraggable != 'undefined')
                this.dragObjectData.isDraggable = options.isDraggable;
            this.$el.addClass('draggable');
            
            if (this.model){
                this.model.set('x', this.model.get('x') || 0);
                this.model.set('y', this.model.get('y') || 0);
                this.dragTo(this.model.get('y'),
                            this.model.get('x'));
            }
            
            var that = this;
            this.$el.on('mousedown touchstart', function(event){that.onDrag.apply(that, [event]);});
            $(document).on('mouseup touchend', function(event){that.onDrop.apply(that, [event]);});
        },
        
        toggleIsDraggable: function(isDraggable){
            if (isDraggable !== null)
                this.dragObjectData.isDraggable = isDraggable;
            else
                this.dragObjectData.isDraggable = !this.dragObjectData.isDraggable;
                
            if (!isDraggable)
                this.onDrop();
        },
        
        dragTo: function(top, left){
            this.$el.css('top', top);
            this.$el.css('left', left);
        },
        
        onDrag: function(event){
            if (this.dragObjectData.draggingUpdateIntervalToken)
                this.onDrop();
            
            if (!this.dragObjectData.isDraggable) return ;
            
            if (event)
                event.preventDefault();
                
            var positionObj = _.first(event.originalEvent.touches) || event;
            
            this.$el.trigger('dragstart', {target: this, pageX: positionObj.pageX, pageY: positionObj.pageY, event:event});
            
            
            this.$el.addClass('dragging');
            this.dragObjectData.thisOffset = this.$el.offset();
            this.dragObjectData.mouseOffset = {
                x: positionObj.pageX,
                y: positionObj.pageY
            };
            this.dragObjectData.originalZIndex = this.$el.css('z-index');
            this.$el.css('position', 'fixed');
            this.$el.css('z-index', 999);
            this.dragTo(this.dragObjectData.thisOffset.top - $(document).scrollTop(),
                        this.dragObjectData.thisOffset.left - $(document).scrollLeft());
            var that = this;            
            this.dragObjectData.draggingUpdateIntervalToken = window.setInterval(function(){
                that.$el.trigger('dragging', {
                    target: that, 
                    pageX:  window.mousePageX,
                    pageY:  window.mousePageY
                });
                that.dragTo(that.dragObjectData.thisOffset.top + window.mousePageY - that.dragObjectData.mouseOffset.y - $(document).scrollTop(),
                            that.dragObjectData.thisOffset.left + window.mousePageX - that.dragObjectData.mouseOffset.x - $(document).scrollLeft());
            }, 20);
        },
        
        onDrop: function(event){
            if (!this.dragObjectData.draggingUpdateIntervalToken) return;
            
            window.clearInterval(this.dragObjectData.draggingUpdateIntervalToken);
            this.dragObjectData.draggingUpdateIntervalToken = null;
            
            var $offsetParent = this.$el.parent(),
                targetPageOffset = this.$el.offset();
            this.dragTo(this.$el.offset().top - $offsetParent.offset().top,
                        this.$el.offset().left - $offsetParent.offset().left);
            this.$el.css('position', '');
            this.$el.css('z-index', this.dragObjectData.originalZIndex || '');
            this.$el.removeClass('dragging');
            
            this.$el.trigger('dragend', {
                target: this, 
                pageX:  window.mousePageX,
                pageY:  window.mousePageY, 
                targetPageX: targetPageOffset.left,
                targetPageY: targetPageOffset.top,
                event:event
            });
        }
    };
    
    return MixinDraggable; 
});