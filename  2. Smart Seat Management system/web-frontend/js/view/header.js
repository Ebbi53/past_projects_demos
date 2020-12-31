define(['jquery', 'underscore', 'backbone', 'text!template/header.html'], function ($, _, Backbone, template) {
    return Backbone.View.extend({
        tagname: 'div',
        className: 'row w-100',
        id: 'heading',
        template: template,

        initialize: function () {
            
            this.render();
        },

        events: {
        },


        render: function () {
            this.$el.html(_.template(this.template));

            $(document).ready(function () {
            })
        },

    })
})