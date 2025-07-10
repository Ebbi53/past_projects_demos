define(['jquery', 'underscore', 'backbone', 'pageAlignment'], function ($, _, Backbone, pageAlignment) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            '*all': function (route) {
                if (route) {
                    route != 'home' ? $('div.circle-loader').removeClass('hidden') : null;
                    $('#body').children().remove()
                    require([`view/${route}`], function (view) {
                        $('#body').html(new view().el)
                    })

                    $('a.nav-link').removeClass('active-section');
                    $(`a[href="#${route}"]`).addClass('active-section');

                } else {
                    this.navigate('home', {
                        trigger: true
                    })
                }
            },
        },
        initialize: function () {

        }
    });

    window.onresize = pageAlignment;

    $(document).ready(function () {
        
        pageAlignment();
        
        $('div.circle-loader').addClass('hidden');

        $('#navbar_button button').click(function (e) {
            $(e.currentTarget).children('i').toggleClass('fa-bars fa-times');
        })

    })

    return new AppRouter();
})