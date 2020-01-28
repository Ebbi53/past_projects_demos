
// public holiday collection
define(['jquery', 'underscore', 'backbone', 'moduleConfig', 'model/public_holiday'], function ($, _, Backbone, moduleConfig, PublicHoliday) {
  var PublicHolidayCollection = Backbone.Collection.extend({
    url: moduleConfig.modelBaseUrlRoot + '?zgAction=getPublicHolidayList',
    model: PublicHoliday
  });
  return PublicHolidayCollection;
});