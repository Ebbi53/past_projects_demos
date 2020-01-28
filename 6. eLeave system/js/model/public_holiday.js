
// public holiday model
define(['jquery', 'underscore', 'backbone', 'moduleConfig'], function ($, _, Backbone, moduleConfig) {
  var PublicHoliday = Backbone.Model.extend({
    url: moduleConfig.modelBaseUrlRoot,
    defaults: {
      'id': null,
      'holiday': '',
      'dateEntry': '',
      'dateValue': ''
    },
    initialize: function initialize() {
      this.set('dateValue', new Date(this.get('dateEntry')).valueOf());
    }
  });
  return PublicHoliday;
});