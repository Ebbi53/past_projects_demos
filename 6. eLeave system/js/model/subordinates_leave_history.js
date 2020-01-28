
// subordinates leave history model
define(['jquery', 'underscore', 'backbone', 'moduleConfig'], function ($, _, Backbone, moduleConfig) {
  var SubordinatesLeaveHistoryModel = Backbone.Model.extend({
    url: moduleConfig.modelBaseUrlRoot + '?zgAction=getLeaveHistory',
    defaults: {
      'date': '',
      'type': '',
      'session': '',
      'employeeName': '',
      'userEmail': '',
      'trxToken': '',
      'id_user': '',
      'approveEmail': '',
      'displayDate': ''
    },
    initialize: function initialize() {
      var that = this;

      var setDisplayDateFormat = function setDisplayDateFormat() {
        var d = new Date(that.get('date'));
        that.set('displayDate', d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear());
      };

      setDisplayDateFormat();
      this.on('change:date', setDisplayDateFormat);
    }
  });
  return SubordinatesLeaveHistoryModel;
});