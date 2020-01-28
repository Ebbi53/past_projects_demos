// editable
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    var MixinEditable = {
        
        init: function(options){
            this.editObjectData={
                isEditable: true,
                isEditing: false,
            };
            
            
            if (typeof options.isEditable != 'undefined')
                this.editObjectData.isEditable = options.isEditable;
            
            
            this.$el.addClass('editable');
            
            // attributes viewTmpl, editTmpl and currentTmpl are required
            // this.currentTmpl is the selected tmpl
            this.viewTmpl = this.viewTmpl || '';
            this.editTmpl = this.editTmpl || '';
            this.currentTmpl = this.currentTmpl || '';
            
            
            var that = this;
            this.$el.on('dblclick', function(event){that.onEdit.apply(that, [event]);});
            $(document).on('mousedown touchend', function(event){that.onEditComplete.apply(that, [event]);});
            
        },
        
        toggleIsEditable: function(isEditable){
            if (isEditable !== null)
                this.editObjectData.isEditable = isEditable;
            else
                this.editObjectData.isEditable = !this.editObjectData.isEditable;
        },
        
        onEdit: function(event){
            if (!this.editObjectData.isEditable) return ;
            
            this.$el.trigger('editing', {target: this, pageX: event.pageX, pageY: event.pageY});
            
            this.$el.addClass('editing');
            this.$el.css('z-index', 999);
            
            this.editObjectData.isEditing = true;
            this.currentTmpl = this.editTmpl;
            this.render();
        },
        
        onEditComplete: function(event){
            if (!this.editObjectData.isEditing
                || (this.editObjectData.isEditing 
                    && $(event.srcElement || event.target).closest('.editable').get(0) == this.el)) 
                return;
            
            
            this.$el.trigger('editComplete', {target: this});
            this.$el.css('z-index', '');
            this.$el.removeClass('editing');
            
            
            this.editObjectData.isEditing = false;
            this.currentTmpl = this.viewTmpl;
            this.render();
            this.$el.trigger('editEnd', {target: this});
        }
    };
    
    return MixinEditable; 
});