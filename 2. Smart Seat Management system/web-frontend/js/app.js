define(['jquery', 'underscore', 'backbone', 'bootstrap', 'router'], function ($, _, Backbone, Bootstrap, Router) {

    var version = 1.3

    var init = function () {
        console.log('Version: ' + version);
        Backbone.history.start(); // Backbone.history.start();
        require(['view/header', 'view/footer', 'view/menu'], function (headerView, footerView, menuView) {
            $('#header').html(new headerView().el);
            $('footer').html(new footerView().el);
            $('#navdiv nav').html(new menuView().el);
        })

        var socket = io()

        var update = () => {
            // console.log('adsasd')
            // location.reload()
        }

        socket.on("RESERVED", update);
        socket.on("AVAILABLE", update);
        socket.on("OCCUPIED", update);
    }
    return {
        init: init,
    }
});