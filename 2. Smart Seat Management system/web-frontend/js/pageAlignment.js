define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
    var maxHeight = function (a, b) {
        return a > b ? a : b;
    }

    return function () {
        $('#reload-icon i').click(() => {
            location.reload()
        })
        if (window.innerWidth <= 992) {

            if ((60 + $('#navbar_button').outerHeight() + $('#navdiv').outerHeight() + $('#body').outerHeight() + $('div#heading').outerHeight() + $('footer').outerHeight()) > window.innerHeight) {
                $('body').css('position', 'relative')
                $('footer').css('bottom', -$('footer').outerHeight() - 60 + 'px')
            } else {
                $('body').css('position', 'static')
                $('footer').css('bottom', 0)
            }

        } else {
            if ((60 + maxHeight($('#navdiv nav').outerHeight() + 23, $('#body').outerHeight()) + $('div#heading').outerHeight() + $('footer').outerHeight()) > window.innerHeight) {
                $('body').css('position', 'relative')
                $('footer').css('bottom', -$('footer').outerHeight() - 60 + 'px')
            } else {
                $('body').css('position', 'static')
                $('footer').css('bottom', 0)
            }
        }
    }
})