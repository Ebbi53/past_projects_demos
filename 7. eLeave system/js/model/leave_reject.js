
// leave balance model
define(['jquery', 'underscore', 'backbone', 'moduleConfig'], function ($, _, Backbone, moduleConfig) {
  var LeaveRejectModel = Backbone.Model.extend({
    url: moduleConfig.modelBaseUrlRoot + '?zgAction=rejectLeaveRequest',
    idAttribute: 'trxToken',
    defaults: {
      'approvalAction': '',
      'trxToken': ''
    }
  });
  return LeaveRejectModel;
});