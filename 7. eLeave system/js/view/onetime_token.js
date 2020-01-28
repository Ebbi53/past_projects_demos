
// login view
define(['jquery', 'underscore', 'backbone', 'model/session', 'text!template/onetime_token.html', 'moduleConfig'], function ($, _, Backbone, Session, tmpl, moduleConfig) {
  var LoginView = Backbone.View.extend({
    tagName: 'div',
    className: 'userView container',
    tisToken: '',
    initialize: function initialize(options) {
      this.vent = options.vent || _.extend({}, Backbone.Events);
      this.tisToken = options.ottoken;
      this.model = this.model || new Session(options.modelJSON || {});
      this.render();
    },
    events: {
      'click #btnSubmit': 'addUser',
      'click .switcher': 'switchUser',
      'click .imok': 'proceedToken'
    },
    render: function render() {
      var runtime = moduleConfig.runtime; //this.model.toJSON()

      this.$el.html(_.template(tmpl)(_.extend({
        runtime: runtime
      }, {
        tisToken: this.tisToken
      })));
    },
    proceedToken: function proceedToken(event) {
      // OneTimeAuthTokenView
      this.model.oneToPerm(this.tisToken, function (model, response, options) {
        alert("Session authenticated, please go back to the original page to continue.");
        window.location.href = "about:blank";
        window.close(); // window.location = window.location.pathname + '#';

      }, function () {
        alert("The token have not activated within 15 minutes, please request a new email token from the login page.");
        Backbone.trigger("global:danger", {
          msg: 'Token expired.'
        });
      });
    },
    switchUser: function switchUser(event) {
      var runtime = moduleConfig.runtime;
      var that = this;
      var $element = $(event.srcElement || event.target),
        my_key = $element.attr('key');
      $.cookie('runtime/session', JSON.stringify(runtime.buf_session[my_key]), {
        expires: 90
      });
      moduleConfig.runtime.session = runtime.buf_session[my_key];
      that.render();
    },
    addUser: function addUser(event) {
      if (event.type == 'keypress' && event.keyCode != 13) return;
      var that = this;
      this.model.set('zgUser', this.$('#txtUsername').val().toLowerCase());
      this.model.set('zgPwd', this.$('#txtPassword').val());
      this.model.set('zgIsOpenToken', "Yes");
      this.model.getNewSession(this.$('#txtUsername').val().toLowerCase(), this.$('#txtPassword').val(), "Yes", function (model, response, options) {
        var bufSession = [];

        if (typeof Storage !== "undefined" && localStorage.buf_session) {
          bufSession = JSON.stringify(localStorage.buf_session);
        } else {
          if ($.cookie('runtime/buf_session')) {
            bufSession = JSON.parse($.cookie('runtime/buf_session'));
          }
        }

        bufSession.push(that.model.toJSON());

        if (typeof Storage !== "undefined" && localStorage.buf_session) {
          localStorage.buf_session = JSON.stringify(moduleConfig.runtime.buf_session);
        } else {
          $.cookie('runtime/buf_session', JSON.stringify(bufSession), {
            expires: 90
          });
        }
        that.render();
      }, function (model, response) {
        that.render();
        that.$('[msgbox=danger]').fadeIn(300).text(response.error || 'Login error'); //Backbone.trigger("global:danger", {msg: response.error || 'Login error'});
      });
      $.cookie('login/zgUser', this.model.get('zgUser'), {
        expires: 90
      });
    }
  });
  return LoginView;
});