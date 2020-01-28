
// login view
define(['jquery', 'underscore', 'backbone', 'text!template/footer.html', 'moduleConfig', 'model/user_status', 'bootstrap', 'jqconfirm'], function ($, _, Backbone, tmpl, moduleConfig, statusModel, bootstrap, jqconfirm) {
  var FooterView = Backbone.View.extend({
    tagName: 'div',
    id: 'footerView',
    initialize: function initialize(options) {
      var that = this;
      this.vent = options.vent || _.extend({}, Backbone.Events);
      this.hasMenu = options.hasMenu || false;
      this.mStatus = this.mStatus || new statusModel(options.modelJSON || {});
      that.mStatus.fetch({
        success: function success() {
          var lastLogin = that.mStatus.toJSON().userStatus.split('Last success logon time')[1].split(/\r\n|\r|\n/g)[1];
          moduleConfig.runtime['lastLogin'] = lastLogin;
          var sess_cnt = that.mStatus.toJSON().userStatus.split('openSessionToken in service count')[1].split(/\r\n|\r|\n/g)[1]; 

          moduleConfig.runtime['sess_cnt'] = sess_cnt;
          var pending_approval_cnt = that.mStatus.toJSON().userStatus.split('pending leave application approval count')[1].split(/\r\n|\r|\n/g)[1];
          moduleConfig.runtime['pending_approval_cnt'] = pending_approval_cnt;
          var pending_endorsement_cnt = that.mStatus.toJSON().userStatus.split('pending leave endorsement count')[1].split(/\r\n|\r|\n/g)[1];
          moduleConfig.runtime['pending_endorsement_cnt'] = pending_endorsement_cnt;
          var sub = that.mStatus.toJSON().userStatus.split(/\r\n|\r|\n/g)[1];
          var takeBankHoliday = that.mStatus.toJSON().userStatus.split('can take leave on bank holiday')[1].split(/\r\n|\r|\n/g)[1] === 'yes' ? true : false;
          moduleConfig.runtime['takeBankHoliday'] = takeBankHoliday;
          var cat = that.mStatus.toJSON().userStatus.split('user category')[1].split(/\r\n|\r|\n/g)[1];
          var isMan = false;

          if (typeof sub !== 'undefined' && sub !== '') {
            isMan = true;
          }

          if (cat.indexOf('Endorser') !== -1) moduleConfig.runtime['isEndorser'] = true; else moduleConfig.runtime['isEndorser'] = false;
          moduleConfig.runtime['isManager'] = isMan;
          that.render();
        },
        error: function error() {
          that.render();
        }
      });
    },
    events: {},
    render: function render() {
      var runtime = moduleConfig.runtime;
      this.$el.html(_.template(tmpl)({
        hasMenu: this.hasMenu,
        runtime: runtime
      }));
    }
  });
  return FooterView;
});