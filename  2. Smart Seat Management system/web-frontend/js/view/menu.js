define(['jquery', 'underscore', 'backbone', 'text!template/menu.html', 'router', 'pageAlignment'], function ($, _, Backbone, template, Router, pageAlignment) {
    return Backbone.View.extend({
        tagname: 'div',
        className: 'collapse navbar-collapse',
        id: 'navbarSupportedContent',
        template: template,

        initialize: function () {
            this.render(100);
        },

        events: {
            'click a[href="#auth"]': function (e) {
                console.log('ads')
                e.preventDefault();
            }
        },


        render: function (progress) {

            this.$el.html(_.template(this.template)(_.extend({
                progress: progress
            })));

            $(document).ready(function () {

                $('#navbarSupportedContent').on('shown.bs.collapse', pageAlignment)

                $('#navbarSupportedContent').on('hide.bs.collapse', () => {

                    if ((60 + $('#navdiv').outerHeight() + $('#body').outerHeight() + $('div#heading').outerHeight() - $('div.navbar-collapse.collapse').outerHeight() + $('footer').outerHeight()) > window.outerHeight) {
                        $('body').css('position', 'relative')
                        $('footer').css('bottom', -$('footer').outerHeight() - 60 + 'px')
                    } else {
                        $('body').css('position', 'static')
                        $('footer').css('bottom', 0)
                    }
                })
            })
        },

    })
})