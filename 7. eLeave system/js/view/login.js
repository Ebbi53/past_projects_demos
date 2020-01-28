
// login view
define(['jquery', 'underscore', 'backbone', 'model/session', 'model/user_status', 'text!template/login.html', 'moduleConfig', 'cookie', 'jqconfirm'], function ($, _, Backbone, Session, UserStatus, tmpl, moduleConfig, Cookie, jqconfirm) {
  Backbone.Events.on('windowClosed', function (future) {
    viewThis.model = new Session({
      sessionToken: future
    });
    viewThis.vent.trigger('login:loginSuccess', {
      target: viewThis,
      session: viewThis.model
    });
  });
  var viewThis;
  var LoginView = Backbone.View.extend({
    tagName: 'div',
    id: 'loginView',
    isShowingSelected: false,
    isShowingOpenToken: false,
    psswd: '',
    initialize: function initialize(options) {
      moduleConfig.runtime.buf_session = JSON.parse(localStorage.buf_session || $.cookie('runtime/buf_session') || '[]');
      viewThis = this;
      this.vent = options.vent || _.extend({}, Backbone.Events);
      this.model = this.model || new Session(options.modelJSON || {});
      this.testStatus = this.testStatus || new UserStatus(options.modelJSON || {});
      this.model.set('zgUser', $.cookie('login/zgUser'));
      this.render();
    },
    events: {
      'click #btnCredential': 'submitCredential',
      'click #btnForgot': 'forgotPW',
      'click #btnGPlusLogin': 'gplogin',
      'click #btnFBLogin': 'fblogin',
      'click #btnLNLogin': 'lnlogin',
      'click  :checkbox': 'clickedCbxOpen',
      'click .switcher': 'switchUser',
      'keypress': 'submitCredential',
      'click  #btnSubmitOTT': 'submitOTT',
      'click .deler': 'deleteUser'
    },
    forgotPW: function forgotPW(event) {
      var that = this;
      this.model.forgotPassword(this.$('#txtUsername').val().toLowerCase(), function (model, response, options) {
        $.alert({
          animation: 'none',
          title: 'Request sent!',
          content: "New password has been generated, please check your email account."
        });
      }, function (model, response) {
        that.render();
        that.$('[msgbox=danger]').fadeIn(300).text(response.error || 'Login error'); 
        //Backbone.trigger("global:danger", {msg: response.error || 'Login error'});
      });
      $.cookie('login/zgUser', this.model.get('zgUser'), {
        expires: 90
      });
    },
    clickedCbxOpen: function clickedCbxOpen(e) {
      var that = this;
      var $target = $(e.target);

      if ($target.attr('id') === 'cbxOneTimeToken') {
        that.isShowingSelected = $target.is(':checked');
      } else if ($target.attr('id') === 'cbxOpenToken') {
        that.isShowingOpenToken = $target.is(':checked');
      }

      this.model.set('zgUser', this.$('#txtUsername').val().toLowerCase());
      this.psswd = this.$('#txtPassword').val();
      this.render();
    },
    switchUser: function switchUser(event) {
      var runtime = moduleConfig.runtime;
      var that = this;
      var $element = $(event.srcElement || event.target),
          my_key = $element.attr('key');
      var sess_obj_str = JSON.stringify(runtime.buf_session[my_key]); //

      var ori_sess = runtime.session;
      runtime.session = runtime.buf_session[my_key];
      Backbone.trigger('global:sessionUpdated'); 

      that.testStatus.fetch({
        success: function success() {
          $.cookie('runtime/session', sess_obj_str);
          $.cookie('welcome_msg', false);
          that.vent.trigger('login:openTokenLogin');
        },
        error: function error() {
          // delete runtime.buf_session;
          $.alert({
            animation: 'none',
            title: 'Token invalidated!',
            content: "Cannot login, session invalidated on other computer. This private session will be removed."
          });

          var tempArr = _.without(runtime.buf_session, _.findWhere(runtime.buf_session, runtime.session));

          runtime.buf_session = tempArr;

          if (typeof Storage !== "undefined") {
            localStorage.buf_session = JSON.stringify(runtime.buf_session);
          } else {
            $.cookie('runtime/buf_session', JSON.stringify(runtime.buf_session), {
              expires: 90
            });
          }

          that.vent.trigger('login:openTokenLogin');
        }
      }); 
    },
    deleteUser: function deleteUser(event) {
      var runtime = moduleConfig.runtime;
      var that = this;
      var $element = $(event.srcElement || event.target);
      var my_key = $element.attr('key');
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
        that.$('[msgbox=danger]').fadeIn(300).text(response.error || 'Error during delete'); //Backbone.trigger("global:danger", {msg: response.error || 'Login error'});
      });
      that.render();
    },
    render: function render() {
      var runtime = moduleConfig.runtime;
      this.$el.html(_.template(tmpl)(_.extend(this.model.toJSON(), {
        isShowingSelected: this.isShowingSelected,
        isShowingOpenToken: this.isShowingOpenToken
      }, {
        runtime: runtime
      }, {
        psswd: this.psswd
      })));
    },
    submitOTT: function submitOTT(event) {
      var that = this;
      var token = this.$('#txtToken').val();
      this.model.oneToPerm(token, function (model, response, options) {
        $('#addUserModal').modal('hide');
        $("body").removeClass("modal-open");
        $('.modal-backdrop').remove();
        that.vent.trigger('login:loginSuccess', {
          target: that,
          session: that.model
        });
      }, function (model, response) {
        that.render();
        that.$('[msgbox=danger]').fadeIn(300).text(response.error || 'Login error'); //Backbone.trigger("global:danger", {msg: response.error || 'Login error'});
      });
    },
    submitCredential: function submitCredential(event) {
      if (event.type == 'keypress' && event.keyCode != 13) return;

      if ($('#addUserModal').hasClass('in')) {
        this.submitOTT(event);
        return;
      }

      var that = this;
      this.model.set('zgUser', this.$('#txtUsername').val().toLowerCase());
      this.model.set('zgPwd', this.$('#txtPassword').val());
      this.model.set('zgIsOpenToken', this.isShowingOpenToken ? 'Yes' : 'No');
      var zgAct = '';

      if (this.isShowingSelected) {
        zgAct = 'getNewOneTimeSession';
      } else {
        zgAct = 'getNewSession';
      }

      var whaOpen = this.isShowingOpenToken ? 'Yes' : 'No';
      this.model[zgAct](this.$('#txtUsername').val().toLowerCase(), this.$('#txtPassword').val(), whaOpen, function (model, response, options) {
        if (that.isShowingSelected) {
          //TODO server side send onetime indicator
          that.model.set('OTTAuthed', false);
          $.alert({
            animation: 'none',
            title: 'Success!',
            content: "an email has been sent to your address, please check."
          });
          that.vent.trigger('login:oneTimeTokenRequested', {
            target: that,
            session: that.model
          });
        } else {
          if (that.isShowingOpenToken) {
            if (typeof Storage !== "undefined") {
              moduleConfig.runtime.buf_session.push(that.model.toJSON());
              localStorage.setItem("buf_session", JSON.stringify(moduleConfig.runtime.buf_session)); // Code for localStorage/sessionStorage.
            } else {
              // Sorry! No Web Storage support..
              moduleConfig.runtime.buf_session.push(that.model.toJSON());
              $.cookie('runtime/buf_session', JSON.stringify(moduleConfig.runtime.buf_session), {
                expires: 90
              });
            }
          }

          that.vent.trigger('login:loginSuccess', {
            target: that,
            session: that.model
          });
        }
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