
// leave balance model
define(['jquery', 'underscore', 'backbone', 'moduleConfig'], function ($, _, Backbone, moduleConfig) {
  var LeaveHistoryModel = Backbone.Model.extend({
    url: moduleConfig.modelBaseUrlRoot + '?zgAction=getLeaveHistory',
    defaults: {
      'date': [],
      'type': [],
      'session': [],
      'id': [],
      'approvalAction': [],
      'trxToken': [],
      'displayDate': []
    },
    initialize: function initialize() {
      var that = this;

      var setDisplayDateFormat = function setDisplayDateFormat() {
        var tempDateArr = [];

        _.each(that.get('date'), function (date, index) {
          var d = new Date(date);
          tempDateArr.push(d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear());
        });

        that.set('displayDate', tempDateArr);
      };

      setDisplayDateFormat();
      this.on('change:date', setDisplayDateFormat);
    },
    removeRecordWithId: function removeRecordWithId(id) {
      var index = this.get('id').indexOf(id);

      if (index >= 0) {
        this.get('id').splice(index, 1);
        this.get('type').splice(index, 1);
        this.get('session').splice(index, 1);
        this.get('displayDate').splice(index, 1);
        this.get('date').splice(index, 1);
        this.get('approvalAction').splice(index, 1);
        this.get('trxToken').splice(index, 1);
      }
    }
  });
  return LeaveHistoryModel;
});