
// session model
define(['jquery', 'underscore', 'backbone', 'moduleConfig'], function ($, _, Backbone, moduleConfig) {
  var Session = Backbone.Model.extend({
    url: moduleConfig.modelBaseUrlRoot + '?zgAction=getNewSession',
    defaults: {
      'id': null,
      'sessionToken': '',
      'timeout': '',
      'user': ''
    },
    testSession: function testSession(sessionKey, successCallback, errorCallback) {
      this.url = moduleConfig.modelBaseUrlRoot + '?zgAction=getUserStatus'; //+loginAction

      var dataToSend = {
        // 'zgAction':loginAction,
        'SessionTokenKey': sessionKey
      };
      this.fetch({
        data: dataToSend,
        dontPutSessionToken: true,
        success: successCallback,
        error: errorCallback
      });
    },
    getNewSession: function getNewSession(zgUser, zgPwd, isOpenTkn, successCallback, errorCallback) {
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
    getNewOneTimeSession: function getNewOneTimeSession(zgUser, zgPwd, isOpenTkn, successCallback, errorCallback) {
      this.url = moduleConfig.modelBaseUrlRoot + '?zgAction=onetimetoken'; //+loginAction

      var dataToSend = {
        // 'zgAction':loginAction,
        'zgUser': zgUser
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
    forgotPassword: function forgotPassword(zgUser, successCallback, errorCallback) {
      this.url = moduleConfig.modelBaseUrlRoot + '?zgAction=newSystemGenPassword';
      this.fetch({
        data: {
          'zgUser': zgUser // 'zgIsOpenToken': isOpenTkn,

        },
        dontPutSessionToken: true,
        success: successCallback,
        error: errorCallback
      });
    },
    oneToPerm: function oneToPerm(zgTrxToken, successCallback, errorCallback) {
      this.url = moduleConfig.modelBaseUrlRoot + '?zgAction=onetimetoken';
      this.fetch({
        data: {
          'zgAction': 'onetimetoken',
          // 'zgAction':loginAction,
          'zgTrxToken': zgTrxToken,
          'zgOnetimeTokenResponse': 'Yes' // 'zgIsOpenToken': isOpenTkn,

        },
        dontPutSessionToken: true,
        success: successCallback,
        error: errorCallback
      });
    },
    invalidateOpenToken: function invalidateOpenToken(sessionKey, successCallback, errorCallback) {
      this.url = moduleConfig.modelBaseUrlRoot + '?zgAction=invalidateOpenToken'; //+loginAction

      this.fetch({
        data: {
          'SessionTokenKey': sessionKey
        },
        dontPutSessionToken: true,
        success: successCallback,
        error: errorCallback
      });
    },
    invalidateAllOpenToken: function invalidateAllOpenToken(successCallback, errorCallback) {
      this.url = moduleConfig.modelBaseUrlRoot + '?zgAction=invalidateAllOpenToken'; //+loginAction

      this.fetch({
        data: {
          'SessionTokenKey': moduleConfig.runtime.session.sessionToken
        },
        dontPutSessionToken: true,
        success: successCallback,
        error: errorCallback
      });
    }
  });
  return Session;
});