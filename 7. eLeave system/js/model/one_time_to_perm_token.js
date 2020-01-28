
// leave application model
define(['jquery', 'underscore', 'backbone', 'moduleConfig'], function ($, _, Backbone, moduleConfig) {
  var LeaveApplicationApprovalModel = Backbone.Model.extend({
    url: moduleConfig.modelBaseUrlRoot + '?zgAction=onetimetoken',
    idAttribute: 'trxToken',
    defaults: {
      'zgTrxToken': '',
      'zgOnetimeTokenResponse': ''
    }
  });
  return LeaveApplicationApprovalModel;
});