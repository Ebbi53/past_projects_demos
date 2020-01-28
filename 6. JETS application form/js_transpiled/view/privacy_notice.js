define(['jquery', 'underscore', 'backbone', 'text!template/privacy_notice.html', 'model/session', 'router'], function ($, _, Backbone, template, Session, Router) {
  return Backbone.View.extend({
    tagname: 'div',
    className: 'container',
    template: template,
    initialize: function initialize() {
      this.render();
    },
    events: {
      'click #applyNow': function clickApplyNow() {
        Session.fetch({
          success: function success() {
            Router.navigate('form', {
              trigger: true
            });
          },
          error: function error() {
            Backbone.Events.trigger('showError', 'server');
          }
        });
      },
      'click div.alert span.closebtn': function clickDivAlertSpanClosebtn(e) {
        $(e.currentTarget).parents('div.alert').fadeOut(300);
        $('div[class*=container] div.row').css('opacity', 1);
      }
    },
    render: function render() {
      this.$el.html(_.template(this.template));

      $(document).ready(function () {
        $('footer').show();
                $(window).scrollTop(0);

        if ($('#body').height() + 100 > window.innerHeight) {
            $('body').css('position', 'relative')
            $('footer').css('bottom', -$('footer').height() + 'px')
        } else {
            $('body').css('position', 'static')
            $('footer').css('bottom', 0)
        }
      })
    }
  });
});