define(['jquery', 'underscore', 'backbone', 'text!template/footer.html'], function ($, _, Backbone, template) {
    return Backbone.View.extend({
        tagname: 'div',
        className: 'row',
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