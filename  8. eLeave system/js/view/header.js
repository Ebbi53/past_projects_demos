
// login view
define(['jquery', 'underscore', 'backbone', 'text!template/header.html', 'moduleConfig', 'bootstrap'], function ($, _, Backbone, tmpl, moduleConfig, bootstrap) {
  var HeaderView = Backbone.View.extend({
    tagName: 'div',
    id: 'headerView',
    initialize: function initialize(options) {
      var that = this;
      this.vent = options.vent || _.extend({}, Backbone.Events);
      this.hasMenu = options.hasMenu || false;
      this.render();
      $('body').on('click', function () {
        $(".navbar-collapse").collapse('hide');
      });
      $('body').on('click', '.kompressor', function () {
        $(".navbar-collapse").collapse('toggle');
      }); // config for listening to global alert msgs

      Backbone.on('global:success', function (msgObj) {
        that.showAlertMsgBox('[msgbox=success]', msgObj);
      });
      Backbone.on('global:info', function (msgObj) {
        that.showAlertMsgBox('[msgbox=info]', msgObj);
      });
      Backbone.on('global:warning', function (msgObj) {
        that.showAlertMsgBox('[msgbox=warning]', msgObj);
      });
      Backbone.on('global:danger', function (msgObj) {
        that.showAlertMsgBox('[msgbox=danger]', msgObj);
      });
    },
    events: {
      'click [menuItemEvent]': 'clickMenuItem'
    },
    render: function render() {
      var runtime = moduleConfig.runtime;
      this.$el.html(_.template(tmpl)({
        hasMenu: this.hasMenu,
        runtime: runtime
      }));
    },
    clickMenuItem: function clickMenuItem(event) {
      var element = event.srcElement || event.target;
      $(element).toggleClass('active');
    },
    showAlertMsgBox: function showAlertMsgBox(domAttr, msgObj) {
      var $element = this.$(domAttr).clone();
      $element.attr('msgBox', '');
      this.$('#msgContainer').append($element.append(msgObj.msg).show(300).delay(3500).fadeOut(300, function () {
        $(this).remove();
      }));
    }
  });
  return HeaderView;
});