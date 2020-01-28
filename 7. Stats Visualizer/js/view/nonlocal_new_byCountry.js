define(['jquery', 'underscore', 'backbone', 'text!template/nonlocal_new_byCountry.html'], function ($, _, Backbone, template) {
    return Backbone.View.extend({
        tagname: 'div',
        className: 'fadeIn',
        template: template,

        initialize: function () {
            this.render()
        },

        events: {
        },

        render: function () {
            this.$el.html(_.template(this.template));

            $(document).ready(function () {
                $('.table-hover tbody tr td, .table-hover tbody tr th').hover(function (e) {
                    $(e.currentTarget).parent('tr').children().addClass('row_hover')
                }, function (e) {
                    $(e.currentTarget).parent('tr').children().removeClass('row_hover')
                })

                if (($('#body').outerHeight() + $('div#heading').outerHeight() + $('footer').outerHeight() + (window.outerWidth > 992 ? 0 : $('#navdiv').outerHeight())) > window.outerHeight) {
                    $('body').css('position', 'relative')
                    $('footer').css('bottom', -$('footer').outerHeight() + 'px')
                } else {
                    $('body').css('position', 'static')
                    $('footer').css('bottom', 0)
                }
            })
        },

    })
})