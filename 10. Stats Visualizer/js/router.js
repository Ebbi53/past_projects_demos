define(['jquery', 'underscore', 'backbone', 'model/data'], function ($, _, Backbone, Data) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            '*all': function (route) {
                if (route) {
                    require([`view/${route}`], function (view) {
                        $('#body').html(new view().el)
                    })
                } else {
                    this.navigate('nonlocal_new_overview', {
                        trigger: true
                    })
                }
            },
        },
    });

    var footerAlignment = function () {
        if (window.innerWidth <= 992) {
            $('#navbar_button button').on('click', function () {

                if ($('div.navbar-collapse.collapse').hasClass('show')) {
                    if (($('#navdiv').outerHeight() + $('#body').outerHeight() + $('div#heading').outerHeight() - $('div.navbar-collapse.collapse').outerHeight() + $('footer').outerHeight()) > window.outerHeight) {
                        $('body').css('position', 'relative')
                        $('footer').css('bottom', -$('footer').outerHeight() + 'px')
                    } else {
                        $('body').css('position', 'static')
                        $('footer').css('bottom', 0)
                    }
                } else {
                    if (($('#navdiv').outerHeight() + $('#body').outerHeight() + $('div#heading').outerHeight() + $('div.navbar-collapse.collapse').outerHeight() + $('footer').outerHeight()) > window.outerHeight) {
                        $('body').css('position', 'relative')
                        $('footer').css('bottom', -$('footer').outerHeight() + 'px')
                    } else {
                        $('body').css('position', 'static')
                        $('footer').css('bottom', 0)
                    }
                }

            })
        }
    }

    window.onresize = footerAlignment;

    footerAlignment();

    var maxHeight = function (a, b) {
        return a > b ? a : b;
    }

    $(document).ready(function () {

        $('#navbar_button button').click(function(e) {
            $(e.currentTarget).children('i').toggleClass('fa-bars fa-times');
        })

        $('.navbar-light .navbar-nav a.nav-link').hover(function (e) {
            $(e.currentTarget).find('div.no-padding').css('padding-left', '12px')
        }, function (e) {
            $(e.currentTarget).find('div.no-padding').css('padding-left', '0')
        })

        $('.navbar-light .navbar-nav a.nav-link').click(function (e) {
            if ($(e.currentTarget).hasClass('nav-link-hover') && !($(e.currentTarget).siblings('div.dropdown-menu').find('li.active-section, a.active-section').length)) {
                $(e.currentTarget).removeClass('nav-link-hover').find('i.fas').addClass('fa-chevron-circle-down').removeClass('fa-chevron-circle-up');
            } else {
                $(e.currentTarget).addClass('nav-link-hover').find('i.fas').removeClass('fa-chevron-circle-down').addClass('fa-chevron-circle-up');
            }

            if (window.innerWidth <= 992) {

                if ($(e.currentTarget).siblings('div.dropdown-menu').hasClass('show')) {
                    if (($('#navdiv').outerHeight() - $(e.currentTarget).siblings('div.dropdown-menu').outerHeight() + $('#body div.fadeIn').outerHeight() + $('div#heading').outerHeight() + $('footer').outerHeight()) > window.outerHeight) {
                        $('body').css('position', 'relative')
                        $('footer').css('bottom', -$('footer').outerHeight() + 'px')
                    } else {
                        $('body').css('position', 'static')
                        $('footer').css('bottom', 0)
                    }
                } else {
    
    
    
    
                    if (($('#navdiv').outerHeight() + $(e.currentTarget).siblings('div.dropdown-menu').outerHeight() + $('#body div.fadeIn').outerHeight() + $('div#heading').outerHeight() + $('footer').outerHeight()) > window.outerHeight) {
                        $('body').css('position', 'relative')
                        $('footer').css('bottom', -$('footer').outerHeight() + 'px')
                    } else {
                        $('body').css('position', 'static')
                        $('footer').css('bottom', 0)
                    }
                }

            } else {
    
                if ($(e.currentTarget).siblings('div.dropdown-menu').hasClass('show')) {
                    if ((30 + maxHeight($('#navdiv nav').outerHeight() - $(e.currentTarget).siblings('div.dropdown-menu').outerHeight(), $('#body div.fadeIn').outerHeight()) + $('div#heading').outerHeight() + $('footer').outerHeight()) > window.outerHeight) {
                        $('body').css('position', 'relative')
                        $('footer').css('bottom', -$('footer').outerHeight() + 'px')
                    } else {
                        $('body').css('position', 'static')
                        $('footer').css('bottom', 0)
                    }
                } else {
    
    
    
    
                    if ((30 + maxHeight($('#navdiv nav').outerHeight() + $(e.currentTarget).siblings('div.dropdown-menu').outerHeight(), $('#body div.fadeIn').outerHeight()) + $('div#heading').outerHeight() + $('footer').outerHeight()) > window.outerHeight) {
                        $('body').css('position', 'relative')
                        $('footer').css('bottom', -$('footer').outerHeight() + 'px')
                    } else {
                        $('body').css('position', 'static')
                        $('footer').css('bottom', 0)
                    }
                }
            }


        })

        $('li.dropdown-li').click(function (e) {
            $(e.currentTarget).parent().find('li.active-section, a.active-section').removeClass('active-section')
            $(e.currentTarget).addClass('active-section').children('a.dropdown-item').addClass('active-section');
        })

        $('.dropdown').on('hide.bs.dropdown', function (e) {

            if (e.clickEvent == undefined) {
                if ($(e.currentTarget).find('li.active-section, a.active-section').length) {
                    e.preventDefault();
                } else {
                    $(e.currentTarget).find('a.nav-link-hover').removeClass('nav-link-hover').find('i.fas').removeClass('fa-chevron-circle-up').addClass('fa-chevron-circle-down');
                }
            } else {
                if ($(e.clickEvent.target).parents('nav').length && $(e.clickEvent.target).parents('li.nav-item.dropdown')[0] != e.currentTarget) {
                    $(e.currentTarget).find('li.active-section, a.active-section').removeClass('active-section');
                    $(e.currentTarget).find('a.nav-link-hover').removeClass('nav-link-hover').find('i.fas').removeClass('fa-chevron-circle-up').addClass('fa-chevron-circle-down');
                } else {
                    e.preventDefault();
                }
            }
        })
    })

    return new AppRouter();
})