
// leave balance model
define(['jquery', 'underscore', 'backbone', 'moduleConfig'], function ($, _, Backbone, moduleConfig) {
  var LeaveBalanceModel = Backbone.Model.extend({
    url: moduleConfig.modelBaseUrlRoot + '?zgAction=invalidateOpenToken',
    defaults: {}
  });
  return LeaveBalanceModel;
});