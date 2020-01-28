
// leave balance model
define(['jquery', 'underscore', 'backbone', 'moduleConfig'], function ($, _, Backbone, moduleConfig) {
  var LeaveBalanceModel = Backbone.Model.extend({
    url: moduleConfig.modelBaseUrlRoot + '?zgAction=getLeaveBalance',
    defaults: {
      'userEmail': '',
      'approverEmail': '',
      'employeeName': '',
      'annualLeaveBalance': '',
      'annualLeaveEntitlementAccumulated': '',
      'annualLeaveAdjustmentAccumulated': '',
      'annualLeaveTakenAccumulated': '',
      'annualLeaveTakenYTD': '',
      'sickLeaveTakenYTD': '',
      'otherLeaveTakenYTD': ''
    }
  });
  return LeaveBalanceModel;
});