
// Leave balance
define(['jquery', 'underscore', 'backbone', 'text!template/leave_balance.html', 'model/leave_balance', 'moduleConfig'], function ($, _, Backbone, tmpl, LeaveBalance, moduleConfig) {
  var LeaveBalanceView = Backbone.View.extend({
    tagName: 'div',
    className: 'leaveBalanceView container fadeIn',
    currentTmpl: tmpl,
    initialize: function initialize(options) {
      this.vent = options.vent || _.extend({}, Backbone.Events);
      this.model = this.model || new LeaveBalance(options.modelJSON || {});
      this.setupEventListeners();
      var that = this;
      this.model.fetch({
        success: function success() {
          moduleConfig.runtime['passwordExpired'] = false;
          that.render(100);
        },
        error: function error(collection, response, options) {
          switch (response.error) {
            case "password expired":
              moduleConfig.runtime['passwordExpired'] = true;
              $.alert({
                animation: 'none',
                title: 'Password expired!',
                content: "Please reset your password."
              });
              window.location = window.location.pathname + '#user';
              break;
          }
        }
      });
      this.render(50);
    },
    events: {},
    setupView: function setupView() { },
    setupEventListeners: function setupEventListeners() {
      var that = this;
    },
    render: function render(progress) {
      this.$el.html(_.template(this.currentTmpl)(_.extend(this.model.toJSON(), {
        progress: progress
      })));
    }
  });
  return LeaveBalanceView;
});