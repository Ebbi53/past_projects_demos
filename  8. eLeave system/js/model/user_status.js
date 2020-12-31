
// leave balance model
define(['jquery', 'underscore', 'backbone', 'moduleConfig'], function ($, _, Backbone, moduleConfig) {
  var LeaveBalanceModel = Backbone.Model.extend({
    url: moduleConfig.modelBaseUrlRoot + '?zgAction=getUserStatus',
    defaults: {
      'userStatus': '',
      'teamLeaveBalance': {}
    },
    testSession: function testSession(zgUser, zgPwd, isOpenTkn, successCallback, errorCallback) {
      this.url = moduleConfig.modelBaseUrlRoot + '?zgAction=getNewSession'; //+loginAction

      var dataToSend = {
        // 'zgAction':loginAction,
        'zgUser': zgUser,
        'zgPwd': zgPwd
      };

      if (isOpenTkn === 'Yes') {
        dataToSend['zgIsOpenToken'] = 'Yes';
      }

      this.fetch({
        data: dataToSend,
        dontPutSessionToken: true,
        success: successCallback,
        error: errorCallback
      });
    },
    apiParser: function apiParser(apiResponse) {
      var userStatus,
          teamLeaveBalance = {};
      userStatus = apiResponse.slice(apiResponse.indexOf('######'));
      var rows = apiResponse.slice(0, apiResponse.indexOf('######')).trim().split('\n');
      var keys = rows[0].split(',');
      keys.forEach(function (element, index, array) {
        array[index] = element.trim().split(' ').join('').split('/').join('');
        teamLeaveBalance[array[index]] = [];
      });

      for (var i = 1; i < rows.length; i++) {
        var cols = rows[i].split(',');
        cols.forEach(function (element, index, array) {
          teamLeaveBalance[keys[index]].push(element);
        });
      }

      this.set('userStatus', userStatus);
      this.set('teamLeaveBalance', teamLeaveBalance);
    }
  });
  return LeaveBalanceModel;
});