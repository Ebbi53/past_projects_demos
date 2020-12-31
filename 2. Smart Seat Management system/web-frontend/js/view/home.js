define(['jquery', 'underscore', 'backbone', 'text!template/home.html', 'model/overview', 'pageAlignment'], function ($, _, Backbone, template, Model, pageAlignment) {
    return Backbone.View.extend({
        tagname: 'div',
        className: 'row mg-bt',
        template: template,
        id: 'home',

        initialize: function () {
            var that = this;
            this.model = Model;
            this.model.fetch({
                success: function () {
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