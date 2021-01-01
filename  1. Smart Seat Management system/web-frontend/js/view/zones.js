define(['jquery', 'underscore', 'backbone', 'text!template/zones.html', 'model/zones', 'pageAlignment', 'timer'], function ($, _, Backbone, template, Model, pageAlignment, Timer) {
    return Backbone.View.extend({
        tagname: 'div',
        className: 'row mg-bt w-100',
        id: 'zones',
        template: template,

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