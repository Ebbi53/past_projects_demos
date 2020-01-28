

define(['jquery', 'underscore', 'backbone', 'text!template/success.html'], function ($, _, Backbone, template) {
    return Backbone.View.extend({
        tagname: 'div',
        className: 'fadeIn container success-container',
        template: template,
        initialize: function initialize() {
            this.render();
        },
        events: {},
        render: function render() {
            this.$el.html(_.template(this.template));
            $(document).ready(function () {
                $('footer').show();
                $(window).scrollTop(0)
                if ($('#body').height() + 100 > window.innerHeight) {
                    $('body').css('position', 'relative')
                    $('footer').css('bottom', -$('footer').height() + 'px')
                } else {
                    $('body').css('position', 'static')                    
                    $('footer').css('bottom', 0)
                }
            });
        }
    });
});