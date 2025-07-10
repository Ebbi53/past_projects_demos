define(['jquery', 'underscore', 'backbone', 'text!template/success.html', 'select2', 'data', 'model/session', 'questionnaire_dataPreparation', "core-js/modules/es6.promise", "core-js/modules/es6.object.to-string", "core-js/modules/es6.array.for-each", "regenerator-runtime/runtime", '_asyncToGenerator'], function ($, _, Backbone, template, select2, data, Session, dataPreparation, _es, _es6Object, _es6Array, _runtime, _asyncToGenerator) {
  return Backbone.View.extend({
    tagname: 'div',
    className: ['container', 'success-container'],
    template: template,
    initialize: function initialize() {
      this.render();
    },
    events: {
      'click #submitButton': function () {
        var _clickSubmitButton = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return dataPreparation();

                  case 2:
                    if (!_context.sent) {
                      _context.next = 7;
                      break;
                    }

                    Backbone.Events.trigger('surveySuccess');
                    $('#questionnaire_modal').modal('hide');
                    _context.next = 7;
                    break;

                  case 7:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

        function clickSubmitButton() {
          return _clickSubmitButton.apply(this, arguments);
        }

        return clickSubmitButton;
      }()
    },
    render: function render() {
      var that = this;
      this.$el.html(_.template(this.template));
      $(document).ready(function () {
        $(window).scrollTop(0);

        if ($('#body').height() + 100 > window.innerHeight) {
          $('body').css('position', 'relative');
          $('footer').css('bottom', -$('footer').height() + 'px');
        } else {
          $('body').css('position', 'static');
          $('footer').css('bottom', 0);
        }

        data.nationalities.forEach(function (e) {
          $('#nationality').append('<option value="' + e + '">' + e + '</option>');
        }); //Questionnaire Modal

        $('#questionnaire_modal').modal('show');
        $('#nationality').select2({
          placeholder: 'Select Nationality'
        });
      });
    }
  });
});