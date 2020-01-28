
// leave application approval collection
define(['jquery', 'underscore', 'backbone', 'moduleConfig', 'model/subordinates_leave_history'], function ($, _, Backbone, moduleConfig, SubordinatesLeaveHistory) {
  var SubordinatesLeaveHistoryCollection = Backbone.Collection.extend({
    url: moduleConfig.modelBaseUrlRoot + '?zgAction=getSubordinatesLeaveHistory',
    model: SubordinatesLeaveHistory,
    getDistinctUserId: function getDistinctUserId() {
      return _.uniq(this.pluck('id_user'));
    }
  });
  return SubordinatesLeaveHistoryCollection;
});