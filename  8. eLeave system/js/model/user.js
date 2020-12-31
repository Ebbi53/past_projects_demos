
// session model
define(['jquery', 'underscore', 'backbone', 'moduleConfig'], function ($, _, Backbone, moduleConfig) {
  var User = Backbone.Model.extend({
    url: moduleConfig.modelBaseUrlRoot + '?zgAction=setNewPassword',
    defaults: {
      'id': null,
      'newPwd': ''
    }
  });
  return User;
});