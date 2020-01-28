
// leave balance model
define(['jquery', 'underscore', 'backbone', 'moduleConfig'], function ($, _, Backbone, moduleConfig) {
  var LeaveEndorseModel = Backbone.Model.extend({
    url: moduleConfig.modelBaseUrlRoot + '?zgAction=endorseLeaveRequest',
    idAttribute: 'trxToken',
    defaults: {
      'approvalAction': '',
      'trxToken': ''
    }
  });
  return LeaveEndorseModel;
});