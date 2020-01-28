
// Leave request model
define(['jquery', 'underscore', 'backbone', 'moduleConfig'], function ($, _, Backbone, moduleConfig) {
  var LeaveRequest = Backbone.Model.extend({
    url: moduleConfig.modelBaseUrlRoot,
    defaults: {
      'id': null,
      'date': '',
      'type': '',
      'trxToken': null,
      'approvalActionAM': null,
      'approvalActionPM': null,
      'displayDate': ''
    },
    initialize: function initialize() {
      var that = this;

      var setDateValue = function setDateValue() {
        that.set('dateValue', new Date(that.get('date')).valueOf());
      };

      setDateValue();
      this.on('change:date', setDateValue);

      var setDisplayDateFormat = function setDisplayDateFormat() {
        var d = new Date(that.get('date'));
        that.set('displayDate', d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear());
      };

      setDisplayDateFormat();
      this.on('change:date', setDisplayDateFormat);
    }
  });
  return LeaveRequest;
});