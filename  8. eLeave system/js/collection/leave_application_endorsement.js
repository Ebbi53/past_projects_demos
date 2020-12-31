
// leave application approval collection
define(['jquery', 'underscore', 'backbone', 'moduleConfig', 'model/leave_application_endorsement'], function ($, _, Backbone, moduleConfig, LeaveApplication) {
  var LeaveApplicationEndorsementCollection = Backbone.Collection.extend({
    url: moduleConfig.modelBaseUrlRoot + '?zgAction=getPendingEndorsementList',
    model: LeaveApplication
  });
  return LeaveApplicationEndorsementCollection;
});