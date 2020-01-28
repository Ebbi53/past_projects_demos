
// login view
define(['jquery', 'underscore', 'backbone', 'model/user', 'text!template/user.html', 'moduleConfig'], function ($, _, Backbone, User, tmpl, moduleConfig) {
  var LoginView = Backbone.View.extend({
    tagName: 'div',
    className: 'userView container fadeIn',
    initialize: function initialize(options) {
      this.vent = options.vent || _.extend({}, Backbone.Events);
      this.model = this.model || new User(options.modelJSON || {});
      this.render();
    },
    events: {
      'click #btnSubmit': 'submitCredential'
    },
    render: function render() {
      this.$el.html(_.template(tmpl)(this.model.toJSON()));
    },
    submitCredential: function submitCredential(event) {
      var that = this,
          pwd2 = this.$('#pwd2').val(),
          pwd = this.$('#pwd').val();

      if (pwd != '' && pwd == pwd2) {
        this.model.set('newPwd', pwd);
        this.model.save(null, {
          success: function success() {
            Backbone.trigger('global:success', {
              msg: 'Your password has been updated.'
            });
            that.render(); //add more

          },
          error: function error(collection, response, options) {
            if (response.error) {
              Backbone.trigger('global:danger', {
                msg: response.error
              });
            } else {
              Backbone.trigger('global:danger', {
                msg: 'Something went wrong. Please try again later.'
              });
            }
          }
        });
      } else {
        Backbone.trigger('global:danger', {
          msg: 'Retype password not the same.'
        });
      }
    }
  });
  return LoginView;
});