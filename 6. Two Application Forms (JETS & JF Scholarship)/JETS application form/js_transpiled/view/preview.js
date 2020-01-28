define(['jquery', 'underscore', 'backbone', 'text!template/preview.html', 'model/session', 'router', 'form_dataPreparation', 'file_upload', "core-js/modules/es6.promise", "core-js/modules/es6.object.to-string", "core-js/modules/es6.array.find", "core-js/modules/es6.regexp.split", "regenerator-runtime/runtime", '_asyncToGenerator'], function ($, _, Backbone, template, Session, Router, dataPreparation, uploadedFile, _es, _es6Object, _es6Array, _es6Regexp, _runtime, _asyncToGenerator) {
  return Backbone.View.extend({
    tagname: 'div',
    className: 'container',
    id: 'preview',
    template: template,
    initialize: function initialize() {
      this.render();
    },
    events: {
      'click #submit_button': function () {
        var _clickSubmit_button = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    $('#confirmation').modal('hide');
                    _context.next = 3;
                    return dataPreparation();

                  case 3:
                    if (!_context.sent) {
                      _context.next = 7;
                      break;
                    }
                    Router.navigate('success', {
                      trigger: true
                    });
                    _context.next = 8;
                    break;

                  case 7:
                    Backbone.Events.trigger('showError', 'server');

                  case 8:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

        function clickSubmit_button() {
          return _clickSubmit_button.apply(this, arguments);
        }

        return clickSubmit_button;
      }(),
      'click #print_button': function clickPrint_button() {
        window.print();
      },
      'click #back_button': function clickBack_button() {
        Router.navigate('', {
          trigger: false
        });

        $(window).scrollTop(0);
        ;
        this.remove();
        $('#form_wrapper').show();
      }
    },
    render: function render() {
      this.$el.html(_.template(this.template));
      $(document).ready(function () {
        $('footer').show();
        $(window).scrollTop(0);

        if ($('#body').height() + 100 > window.innerHeight) {
          $('body').css('position', 'relative');
          $('footer').css('bottom', -$('footer').height() + 'px');
        } else {
          $('body').css('position', 'static');
          $('footer').css('bottom', 0);
        }

        $('#applicant_name').text($('#first_name').val() + " " + $('#family_name').val());
        $('.second_column').each(function () {
          var content_id = $(this).attr('id').split('_preview')[0],
            content = '',
            $input = $("[name=".concat(content_id, "]"));

          if (content_id == 'contact_number') {
            content += $('#phone_mobile_country').val() + ' ' + $('#phone_mobile_telephone').val();

          } else if ($input.is('input[type=radio]')) {
            content += $('input[name=' + content_id + ']:checked').val();

            if ($('input[name=' + content_id + ']:checked').val() == 'Yes' && $input.parents('div.parentWithSpecific').length) {
              var $elSelector = $input.parents('div.parentWithSpecific').find("".concat($input.hasClass('withRadio') ? "input[name=".concat($input.siblings('label').attr('for'), "]:checked") : 'input.specific'));
              content += " (".concat($elSelector.val(), ")");
            }
          } else if ($input.is('input[type=checkbox]')) {
            $input.each(function () {
              $(this).prop('checked') ? content += "".concat($(this).val()) : null;

              if ($(this).prop('checked') && $(this).parents('div.parentWithSpecific').length) {
                var $elSelector = $(this).parents('div.parentWithSpecific').find("".concat($(this).hasClass('withRadio') ? "input[name=".concat($(this).siblings('label').attr('for'), "]:checked") : 'input.specific'));
                content += " (".concat($elSelector.val(), ")");
              }

              $(this).prop('checked') ? content += '\n' : null;
            });
          } else {
            content += $input.val();

            if ($input.val() == 'Other' && $input.parents('div.parentWithSpecific').length) {
              var $elSelector = $input.parents('div.parentWithSpecific').find('input.specific');
              content += " (".concat($elSelector.val(), ")");
            }
          }

          $(this).text(content);
        });
        for (var key in uploadedFile.uploadData) {
          $('#' + key + '_preview').text(uploadedFile.uploadData[key]);
        }
      });
    }
  });
});
