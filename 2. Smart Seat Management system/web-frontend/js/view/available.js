define(['jquery', 'underscore', 'backbone', 'text!template/available.html', 'model/available', 'pageAlignment'], function ($, _, Backbone, template, Model, pageAlignment) {
    return Backbone.View.extend({
        tagname: 'div',
        className: 'row mg-bt w-100',
        template: template,
        id: 'available',

        initialize: function () {
            var that = this;
            this.model = Model;
            this.model.fetch({
                success: function () {
                    console.log(that.model.attributes)
                    that.render();
                }
            });
        },

        events: {
        },


        render: function () {
            this.$el.html(_.template(this.template)(_.extend(this.model.toJSON())));


            $(document).ready(function () {
                pageAlignment();
            })
        },

    })
})