
// login view
define(['jquery', 'underscore', 'backbone', 'model/session', 'text!template/switch_user.html', 'moduleConfig', 'model/user_status'], function ($, _, Backbone, Session, tmpl, moduleConfig, UserStatus) {
  var LoginView = Backbone.View.extend({
    tagName: 'div',
    className: 'userView container',
    initialize: function initialize(options) {
      moduleConfig.runtime.buf_session = JSON.parse(localStorage.buf_session || $.cookie('runtime/buf_session') || '[]'); 

      this.vent = options.vent || _.extend({}, Backbone.Events);
      this.testStatus = this.testStatus || new UserStatus(options.modelJSON || {});
      this.model = this.model || new Session(options.modelJSON || {});
      this.render();
    },
    events: {
      'click #btnSubmit': 'addUser',
      'click #btnInvalidate': 'invalidateAllSession',
      'click .switcher': 'switchUser',
      'click .deler': 'deleteUser',
      'keypress': 'addUser'
    },
    render: function render() {
      var runtime = moduleConfig.runtime; //this.model.toJSON()

      this.$el.html(_.template(tmpl)({
        runtime: runtime
      }));
    },
    deleteUser: function deleteUser(event) {
      this.rmBackdrop();
      var runtime = moduleConfig.runtime;
      var that = this;
      var $element = $(event.srcElement || event.target),
          my_key = $element.attr('key');
      var del_session = runtime.buf_session.splice(my_key, 1);
      that.model.invalidateOpenToken(del_session[0].sessionToken, function (model, response, options) {
        if (typeof Storage !== "undefined") {
          localStorage.buf_session = JSON.stringify(runtime.buf_session);
        } else {
          $.cookie('runtime/buf_session', JSON.stringify(runtime.buf_session), {
            expires: 90
          });
        }

        that.render();
      }, function (model, response) {
        if (typeof Storage !== "undefined") {
          localStorage.buf_session = JSON.stringify(runtime.buf_session);
        } else {
          $.cookie('runtime/buf_session', JSON.stringify(runtime.buf_session), {
            expires: 90
          });
        }

        that.render();
        that.$('[msgbox=danger]').fadeIn(300).text(response.error || 'Error during delete on server, user session invalidated.'); //Backbone.trigger("global:danger", {msg: response.error || 'Login error'});
      });
    },
    switchUser: function switchUser(event) {
      this.rmBackdrop();
      var runtime = moduleConfig.runtime;
      var that = this;
      var $element = $(event.srcElement || event.target),
          my_key = $element.attr('key'); 

      that.model.testSession(moduleConfig.runtime.buf_session[my_key].sessionToken, function () {
        $.cookie('runtime/session', JSON.stringify(runtime.buf_session[my_key]), {
          expires: 90
        });
        $.cookie('welcome_msg', false);
        moduleConfig.runtime.session = runtime.buf_session[my_key];
        window.location = window.location.href.split('#')[0] + '#';
        location.reload();
      }, function (err) {

        $.alert({
          animation: 'none',
          title: 'Token invalidated!',
          content: "Cannot login, session invalidated on other computer. This private session will be removed."
        });

        var tempArr = _.without(runtime.buf_session, _.findWhere(runtime.buf_session, runtime.buf_session[my_key]));

        runtime.buf_session = tempArr;

        if (typeof Storage !== "undefined") {
          localStorage.buf_session = JSON.stringify(runtime.buf_session);
        } else {
          $.cookie('runtime/buf_session', JSON.stringify(runtime.buf_session), {
            expires: 90
          });
        }

        that.render();
      }); //  that.render();
    },
    invalidateAllSession: function invalidateAllSession(event) {
      var that = this;
      $('#invalidateAllSessionModal').modal('hide');
      var runtime = moduleConfig.runtime;
      $("body").removeClass("modal-open");
      $('.modal-backdrop').remove();
      that.model.invalidateAllOpenToken(function (model, response, options) {
        var tempArr = _.filter(runtime.buf_session, function (itm) {
          return itm.user !== runtime.session.user;
        });

        runtime.buf_session = tempArr;

        if (typeof Storage !== "undefined") {
          localStorage.buf_session = JSON.stringify(runtime.buf_session);
        } else {
          $.cookie('runtime/buf_session', JSON.stringify(runtime.buf_session), {
            expires: 90
          });
        }

        that.vent.trigger('switch_user:cleared_all_open_tkn', {
          target: that,
          session: that.model
        });
      }, function (model, response) {
        that.render();
        that.$('[msgbox=danger]').fadeIn(300).text(response.error || 'Error during delete all token'); //Backbone.trigger("global:danger", {msg: response.error || 'Login error'});
      });
    },
    rmBackdrop: function rmBackdrop() {
      this.$('.modal').modal("hide");
      $("body").removeClass("modal-open");
      $('.modal-backdrop').remove();
    },
    addUser: function addUser(event) {
      if (event.type == 'keypress' && event.keyCode != 13) return;
      var that = this;
      this.model.set('zgUser', this.$('#txtUsername').val().toLowerCase());
      this.model.set('zgPwd', this.$('#txtPassword').val());
      this.model.set('zgIsOpenToken', "Yes");
      this.model.getNewSession(this.$('#txtUsername').val().toLowerCase(), this.$('#txtPassword').val(), "Yes", function (model, response, options) {
        moduleConfig.runtime.buf_session.push(that.model.toJSON());

        if (typeof Storage !== "undefined") {
          localStorage.buf_session = JSON.stringify(moduleConfig.runtime.buf_session);
        } else {
          $.cookie('runtime/buf_session', JSON.stringify(moduleConfig.runtime.buf_session), {
            expires: 90
          });
        }

        that.rmBackdrop();

        Backbone.trigger('global:success', {
          msg: 'Add user success'
        });
        that.render();
      }, function (model, response) {
        that.rmBackdrop();
        that.render(); 

        Backbone.trigger("global:danger", {
          msg: response.error || 'Login error'
        });
      });
      $.cookie('login/zgUser', this.model.get('zgUser'), {
        expires: 90
      });
    }
  });
  return LoginView;
});