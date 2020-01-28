// resizable
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    var MixinResizable = {
        
        init: function(options){
            this.resizeObjectData = {
                isResizable: true,
                isAutoResize: true,
                defaultWdith: 200,
                defaultHeight: 100,
                resizingUpdateIntervalToken: null,
                mouseOffset:{
                    x: 0,
                    y: 0
                },
                thisSize: {
                    width: 0,
                    height:0
                }
            };
            
            if (typeof options.isResizable != 'undefined')
                this.resizeObjectData.isResizable = options.isResizable;
            
            
            this.$el.addClass('resizable');
            
            this.model = this.model || new Backbone.Model();
            this.resizeObjectData.thisSize.width = this.model.get('width') || this.resizeObjectData.defaultWdith;
            this.resizeObjectData.thisSize.height = this.model.get('height') || this.resizeObjectData.defaultheight;
            this.resizeTo(this.resizeObjectData.thisSize.width,
                            this.resizeObjectData.thisSize.height);
            this.resizeItem();
            
            
            var that = this,
                addResizeBtn = function(){
                    if (!this.resizeObjectData.isResizable) return;
                    this.$el.append(
                        $('<span>')
                            .addClass('resizeBtn')
                            .attr('btn_resize', '')
                            .css('position', 'absolute')
                            .text('R')
                    );
                };
            addResizeBtn.apply(this);
            
            $(document).on('mouseup touchend', function(event){
                that.onResizeEnd.apply(that, [event]);
            });
            
            
            // listen to event 
            this.on('autoResizeItem', function(){that.resizeItem.apply(that)});
            
            this.on('renderComplete', function(){
                addResizeBtn.apply(that);
                that.resizeItem();
                that.$('[btn_resize]').on('mousedown touchstart', function(event){that.onResize.apply(that, [event]);});
            });
        },
        
        toggleIsResizable: function(isResizable){
            if (isResizable !== null)
                this.resizeObjectData.isResizable = isResizable;
            else
                this.resizeObjectData.isResizable = !this.resizeObjectData.isResizable;
                
            this.render();
        },
        
        resizeTo: function(width, height){
            this.$el.css('width', width);
            //this.$el.css('height', height);
        },
        
        resizeItem: function(){
            var that = this;
            this.$('[resize_width]').each(function(){
                var $parent = $(this).parent().closest('[resize_width], .' + that.$el.attr('class').replace(/ /g, '.'));
                $(this).css('width', $parent.width() * Number(eval($(this).attr('resize_width'))));
            });
        },
        
        onResize: function(){
            
            if (this.resizeObjectData.resizingUpdateIntervalToken)
                this.onResizeEnd();
            
        
            if (!this.resizeObjectData.isResizable) return;
            
            this.$el.trigger('resizestart', {target: this});
            
            var that = this;
            this.resizeObjectData.mouseOffset = {
                x: window.mousePageX,
                y: window.mousePageY
            };
            
            this.resizeObjectData.thisSize = {
                width: this.$el.width(),
                height: this.$el.height()
            }
            
            this.resizeObjectData.resizingUpdateIntervalToken = window.setInterval(function(){
                that.$el.trigger('resizing', {target: that});
                that.resizeTo(window.mousePageX - that.resizeObjectData.mouseOffset.x + that.resizeObjectData.thisSize.width,
                            window.mousePageY - that.resizeObjectData.mouseOffset.y + that.resizeObjectData.thisSize.height);
                
                that.resizeItem();
            }, 20);
        },
        
        onResizeEnd: function(){
            if (!this.resizeObjectData.resizingUpdateIntervalToken) return;
            
            window.clearInterval(this.resizeObjectData.resizingUpdateIntervalToken);
            this.resizeObjectData.resizingUpdateIntervalToken = null;
            this.$el.trigger('resizeEnd', {target: this});
        }
    };
    
    return MixinResizable; 
});