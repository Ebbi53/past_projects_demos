
// public holiday collection
define(['jquery', 'underscore', 'backbone', 'moduleConfig', 'model/leave_request'], function ($, _, Backbone, moduleConfig, LeaveRequest) {
  var LeaveRequestCollection = Backbone.Collection.extend({
    url: moduleConfig.modelBaseUrlRoot + '?zgAction=postLeaveRequest',
    model: LeaveRequest,
    comparator: 'dateValue',
    setByLeaveHistory: function setByLeaveHistory(leaveHistory, exceptApprovalActionArr) {
      var that = this,
          idArr = leaveHistory.get('id'),
          dateArr = leaveHistory.get('date'),
          sessionArr = leaveHistory.get('session'),
          typeArr = leaveHistory.get('type'),
          trxTokenArr = leaveHistory.get('trxToken'),
          approvalActionArr = leaveHistory.get('approvalAction');
      var tempArr = [];

      _.each(leaveHistory.get('date'), function (date, index) {
        if (exceptApprovalActionArr && exceptApprovalActionArr.indexOf(approvalActionArr[index]) != -1) return;
        tempArr.push(new LeaveRequest({
          id: idArr[index],
          date: dateArr[index],
          session: sessionArr[index],
          type: typeArr[index],
          trxToken: trxTokenArr[index],
          approvalAction: approvalActionArr[index]
        }));
      });

      that.reset(tempArr);
    },
    save: function save(options) {
      Backbone.sync("create", this, options);
    }
  });
  return LeaveRequestCollection;
});