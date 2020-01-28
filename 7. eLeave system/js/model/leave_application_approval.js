
// leave application model
define(['jquery', 'underscore', 'backbone', 'moduleConfig'], function ($, _, Backbone, moduleConfig) {
  var LeaveApplicationApprovalModel = Backbone.Model.extend({
    url: moduleConfig.modelBaseUrlRoot + '?zgAction=getOneTimeApproval',
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
  return LeaveApplicationApprovalModel;
});