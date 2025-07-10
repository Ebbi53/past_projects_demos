
// leave application model
define(['jquery', 'underscore', 'backbone', 'moduleConfig'], function ($, _, Backbone, moduleConfig) {
  var LeaveApplicationEndorsementModel = Backbone.Model.extend({
    url: moduleConfig.modelBaseUrlRoot + '?zgAction=getOneTimeEndorse',
    idAttribute: 'trxToken',
    defaults: {
      'date': [],
      'type': [],
      'session': [],
      'user': '',
      'action': '',
      'approvalAction': '',
      'approver': '',
      'trxToken': '',
      'leaveRemark': '',
      'annualLeaveBalance': ''
    }
  });
  return LeaveApplicationEndorsementModel;
});