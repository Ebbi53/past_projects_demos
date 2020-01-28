
// leave application approval collection
define(['jquery', 'underscore', 'backbone', 'moduleConfig', 'model/leave_application_approval'], function ($, _, Backbone, moduleConfig, LeaveApplication) {
  var LeaveApplicationApprovalCollection = Backbone.Collection.extend({
    url: moduleConfig.modelBaseUrlRoot + '?zgAction=getPendingApprovalList',
    model: LeaveApplication
  });
  return LeaveApplicationApprovalCollection;
});