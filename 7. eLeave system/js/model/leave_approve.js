
// leave balance model
define(['jquery', 'underscore', 'backbone', 'moduleConfig'], function ($, _, Backbone, moduleConfig) {
  var LeaveApproveModel = Backbone.Model.extend({
    url: moduleConfig.modelBaseUrlRoot + '?zgAction=approveLeaveRequest',
    idAttribute: 'trxToken',
    defaults: {
      'approvalAction': '',
      'trxToken': ''
    }
  });
  return LeaveApproveModel;
});