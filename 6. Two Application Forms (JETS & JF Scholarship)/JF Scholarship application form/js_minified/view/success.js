define(["jquery", "underscore", "backbone", "text!template/success.html"], function (a, b, c, d) { return c.View.extend({ tagname: "div", className: "fadeIn container success-container", template: d, initialize: function () { this.render() }, events: {}, render: function () { this.$el.html(b.template(this.template)), a(document).ready(function () { a("footer").show(), a(window).scrollTop(0), a("#body").height() + 100 > window.innerHeight ? (a("body").css("position", "relative"), a("footer").css("bottom", -a("footer").height() + "px")) : (a("body").css("position", "static"), a("footer").css("bottom", 0)) }) } }) });