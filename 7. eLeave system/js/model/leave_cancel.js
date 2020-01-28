
// leave balance model
define(['jquery', 'underscore', 'backbone', 'moduleConfig'], function ($, _, Backbone, moduleConfig) {
  var LeaveCancelModel = Backbone.Model.extend({
    url: moduleConfig.modelBaseUrlRoot + '?zgAction=cancelLeaveRequest',
    idAttribute: 'trxToken',
    defaults: {
      'id': null
    }
  });
  return LeaveCancelModel;
});