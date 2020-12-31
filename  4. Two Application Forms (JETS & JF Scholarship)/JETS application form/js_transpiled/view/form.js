define(['jquery', 'underscore', 'backbone', 'text!template/form.html', 'file_upload', 'select2', 'data', 'form_validation', 'router', 'model/session', 'api_config', "core-js/modules/es6.promise", "core-js/modules/es6.object.to-string", "core-js/modules/es6.regexp.match", "core-js/modules/es6.array.for-each", "core-js/modules/es6.regexp.split", "core-js/modules/es7.array.includes", "core-js/modules/es6.string.includes", "regenerator-runtime/runtime", "core-js/modules/es6.array.find", '_asyncToGenerator'], function ($, _, Backbone, template, fileupload, select2, data, validation, Router, Session, api_config, _es, _es6Object, _es6Regexp, _es6Array, _es6Regexp2, _es7Array, _es6String, _runtime, _es6Array2, _asyncToGenerator) {
  return Backbone.View.extend({
    tagname: 'div',
    className: 'container-fluid form_page fadeIn',
    template: template,
    counter: 1,
    work_counter: 1,
    initialize: function initialize() {
      this.render();
    },
    events: {
      'change .hasSpecifics': function changeHasSpecifics(e) {
        var $elSelector = $(e.currentTarget).parents('div.parentWithSpecific').find("".concat($(e.currentTarget).hasClass('withRadio') ? 'div.career_specific' : 'input.specific'));

        if ($(e.currentTarget).is(':checked') || !$(e.currentTarget).is('input') && $(e.currentTarget).val() == 'Other') {
          if ($(e.currentTarget).hasClass('withRadio')) {
            $(e.currentTarget).siblings('label').addClass('compulsory');
          } else {
            $elSelector.addClass('compulsory');
          }

          $elSelector.is('[name=specific_of_work]') ? $elSelector.parents('div.parentWithSpecific').find('div.career_specific').show() : $elSelector.show();
        } else {
          if ($(e.currentTarget).hasClass('withRadio')) {
            $($(e.currentTarget).parents('.form-group')[0]).find('label').removeClass('compulsory incomplete-label');
            $($(e.currentTarget).parents('.form-group')[0]).find('input').prop('checked', false);
          } else {
            $elSelector.removeClass('compulsory incomplete-input').val('');
          }

          $elSelector.is('[name=specific_of_work]') ? $elSelector.parents('div.parentWithSpecific').find('div.career_specific').hide().find('label') : $elSelector.hide();
        }
      },
      'change .removeInput': function changeRemoveInput(e) {
        $(e.currentTarget).parents('div.parentWithSpecific').find('input.hasSpecifics').trigger('change');
      },
      'click .section_heading': function clickSection_heading(e) {
        $(e.currentTarget.nextElementSibling).slideToggle(300);
        $(e.currentTarget.children[0].children).toggleClass('hidden');
      },
      'change #phone_mobile_country': function changePhone_mobile_country(e) {
        $('#select2-phone_mobile_country-container').text($(e.currentTarget).val());
      },
      'click a.nav-link': function clickANavLink(e) {
        e.preventDefault();
        $(window).scrollTop($($(e.currentTarget).attr('href')).offset().top);
      },
      'click button.undoBtn': function clickButtonUndoBtn(e) {
        fileupload.uploadData[$(e.currentTarget).parents('.form-group').find('input').attr('name')] = '';
        $(e.currentTarget).parents('.form-group').children('div.uploadBtn').toggle();
        $(e.currentTarget).prop('disabled', true);
      },
      'click div.uploadProgress div.cancelUpload': function clickDivUploadProgressDivCancelUpload(e) {
        if (fileupload.jqXHR[$(e.currentTarget).parents('.form-group').find('input').prop('name')] !== undefined) {
          fileupload.jqXHR[$(e.currentTarget).parents('.form-group').find('input').prop('name')].abort();
          Backbone.Events.trigger('showError', 'cancelUpload');
        }
      },
      'click #validate_button': function () {
        var _clickValidate_button = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee() {
            var validationResults;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return validation();

                  case 2:
                    validationResults = _context.sent;

                    if (validationResults.success) {
                      Router.navigate('preview', {
                        trigger: true
                      });
                    } else {
                      Backbone.Events.trigger('showError', validationResults.hasDeclared ? 'validation' : 'declaration');
                      validationResults.hasDeclared ? $(window).scrollTop($($('.sections').has('[class*=incomplete]')[0]).offset().top - (window.innerWidth <= 991 ? $('nav.navbar').outerHeight() : 0)) : null;
                    }

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

        function clickValidate_button() {
          return _clickValidate_button.apply(this, arguments);
        }

        return clickValidate_button;
      }(),
      'input .num': function inputNum(e) {
        if (!this.checkValid($(e.currentTarget).val(), ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '', '-', ' ', '(', ')'])) {
          $(e.currentTarget).addClass('incomplete-input invalid');
          $(e.currentTarget).next('.invalid_number').show();
        } else {
          $(e.currentTarget).removeClass('incomplete-input invalid');
          $(e.currentTarget).next('.invalid_number').hide();
        }
      },
      'change .email_address': function changeEmail_address(e) {
        valid_email = false;
        if ($(e.currentTarget).val().length != 0 && (!$(e.currentTarget).val().includes('@') || !$(e.currentTarget).val().includes('.'))) $(e.currentTarget).next('.invalid_email').show(); else $(e.currentTarget).next('.invalid_email').hide();

        if ($(e.currentTarget).parent().next().find('.conf_email_address').val() != '') {
          if ($(e.currentTarget).val() != $(e.currentTarget).parent().next().find('.conf_email_address').val()) {
            $(e.currentTarget).parent().next().find('.conf_email_address').nextAll('.invalid_conf_email').show();
          } else {
            $(e.currentTarget).parent().next().find('.conf_email_address').nextAll('.invalid_conf_email').hide();
          }
        }

        if ($(e.currentTarget).hasClass('conf_email_address')) {
          if ($(e.currentTarget).val() != $(e.currentTarget).parent().prev().find('.email_address').val()) $(e.currentTarget).nextAll('.invalid_conf_email').show(); else $(e.currentTarget).nextAll('.invalid_conf_email').hide();
        }

        $('.invalid_email').each(function () {
          if ($(this).css('display') == 'block' || $(this).next('.invalid_conf_email').css('display') == 'block') $(this).prevAll('.email_address').addClass('incomplete-input invalid'); else $(this).prevAll('.email_address').removeClass('incomplete-input invalid');
        });
        if (!$(e.currentTarget).hasClass('incomplete-input') && $(e.currentTarget).val().length != 0) valid_email = true;

        if (valid_email && !$(e.currentTarget).hasClass('conf_email_address')) {
          $.ajax({
            type: 'PUT',
            data: JSON.stringify({
              "token": Session.get('applicationtoken'),
              "email": $(e.currentTarget).val()
            }),
            contentType: 'application/json',
            url: api_config.protocol + api_config.domain + api_config.path + 'application'
          }).done(function (data) {
            if (data.result_code == -6) {
              Backbone.Events.trigger('showError', 'emailReUse');
              $(e.currentTarget).next('.invalid_email').show()
              $(e.currentTarget).addClass('incomplete-input invalid')
            } else if (data.result_code == -9 || data.result_code == -10) {
              Session.update();
            } else {
              $(e.currentTarget).next('.invalid_email').hide()
              $(e.currentTarget).removeClass('incomplete-input invalid')
            }
          });
        }
      }
    },
    underscore: function underscore(e) {
      return e.toLowerCase().split(' ').join('_');
    },
    checkValid: function checkValid(string, list) {
      arr = string.split('');
      var include = true;
      if (arr.length > 0) for (var i = 0; i < arr.length; i++) {
        if (!list.includes(arr[i])) {
          include = false;
          break;
        }
      }
      return include;
    },
    sentence_case: function sentence_case(e) {
      var temp = e.split(' ');
      e = '';
      var x, m;
      temp.forEach(function (f) {
        x = f.charAt(0).toUpperCase();
        m = f.substring(1).toLowerCase();
        e = e + x + m + ' ';
      });
      return e;
    },
    bracket_value: function bracket_value(e) {
      var regExp = /\(([^)]+)\)/;
      var brack = regExp.exec(e)[0];
      return brack.match(/\(([^)]+)\)/)[1];
    },
    populateDropdown: function populateDropdown(id, array) {
      array.forEach(function (e) {
        $(id).append('<option value="' + e + '">' + e + '</option>');
      });
    },
    exit: function exit() {
      alert('sure?');
    },
    render: function render() {
      var that = this;
      this.$el.html(_.template(this.template));
      $(document).ready(function () {
        $('footer').show();
        $(window).scrollTop(0);
        $('body').scrollspy({
          target: '.navbar'
        });

        if ($('#body').height() + 100 > window.innerHeight) {
          $('body').css('position', 'relative');
          $('footer').css('bottom', -$('footer').height() + 'px');
        } else {
          $('body').css('position', 'static');
          $('footer').css('bottom', 0);
        }

        var isIE =
          /*@cc_on!@*/
          false || !!document.documentMode;

        if (isIE) {
          $('input[type=file]').click(function (e) {
            e.stopPropagation();
          });
          $('button.fileinput-button').click(function (e) {
            $(e.currentTarget).find('input').trigger('click');
          });
        }

        $('.nav-link').hover(function () {
          $(this).toggleClass('.active');
        });
        $('select').select2({
          minimumResultsForSearch: 10,
          placeholder: ''
        });
        $('#phone_mobile_country').select2({
          placeholder: 'Area Code'
        });

        that.populateDropdown('#study_field_tertiary_education', data.broad_subject);
        that.populateDropdown('.company_choice', data.companies);
        data.university.forEach(function (e) {
          $('#university_of_tertiary_education').append('<option value="' + e + '">' + that.sentence_case(e) + '</option>');
        });

        var _loop = function _loop(key) {
          temp = "<label class=\"col-12\"><u><i>".concat(key, "</i></u></label>");
          data.recruitment_source[key].forEach(function (e, index) {
            if (e == 'Career Fair' || e == 'Career Talk' || e == 'On-Campus Roadshow') {
              temp += "<div class=\"col-12\"><div class=\"form-group row parentWithSpecific\"><div class=\"col-12\"><input type=\"checkbox\" class=\"withRadio hasSpecifics\" name=\"source\" id=\"source\" value=\"".concat(e, "\"><label for=\"specific_of_").concat(that.underscore(e), "\" class=\"form-check-label\">").concat(e, "</label></div><div class=\"col-12 hidden career_specific\"><div class=\"row\">");
              data.dropBullets[that.underscore(e)].forEach(function (f) {
                temp += "<div class=\"col-12\"><input type=\"radio\" name='specific_of_".concat(that.underscore(e), "' name=\"source\" value=\"").concat(f, "\"><label class=\"form-check-label\">").concat(f, "</label></div>");
              });
              temp += '</div></div></div></div>';
            } else if (e == 'Other' || e == 'Referral') {
              temp += "<div class=\"col-12\"><div class=\"form-group row parentWithSpecific\"><div class=\"col-12\"><input type=\"checkbox\" name=\"source\" id=\"source\" class =\"hasSpecifics\" value=\"".concat(e == 'Other' ? "Other ".concat(key) : e, "\"><label for=\"specific_of_").concat(e == 'Other' ? "".concat(key.split(' ')[0].toLocaleLowerCase(), "_other_source") : 'referral', "\" class=\"form-check-label\">").concat(e, "</label></div><div class=\"col-12\"><input type=\"text\" name=\"specific_of_").concat(e == 'Other' ? "".concat(key.split(' ')[0].toLocaleLowerCase(), "_other_source") : 'referral', "\" class=\"specific hidden form-control-sm\" placeholder=\"Please Specify\"></div></div></div>");
            } else {
              temp += "<div class=\"col-12\"><input type=\"checkbox\" name=\"source\" id=\"source\" value=\"".concat(e == 'Other' ? "Other ".concat(key) : e, "\"><label class=\"form-check-label\">").concat(e, "</label></div>");
            }
          });
          $('#src').append(temp);
        };

        for (var key in data.recruitment_source) {
          var temp;

          _loop(key);
        }

        data.country_codes.forEach(function (e) {
          $('#phone_mobile_country').append('<option value="' + that.bracket_value(e) + '">' + e + '</option>');
        });
        $('.invalid_number').html('&nbsp;&nbsp;<i><span style="color:#CC0000"><i class="fas fa-exclamation"></i> Invalid Character</span></i>');
        $('.invalid_email').html('&nbsp;&nbsp;<i><span style="color:#CC0000"><i class="fas fa-exclamation"></i> Invalid Email</span></i>');
        $('.invalid_conf_email').html('&nbsp;&nbsp;<i><span style="color:#CC0000"><i class="fas fa-exclamation"></i> Should be same as the above email</span></i>');
        $('.invalid_choice').html('&nbsp;&nbsp;<i><span style="color:#CC0000"><i class="fas fa-exclamation"></i> Please Choose different companies</span></i>');
        $(".section_heading").hover(function () {
          $(this).css('color', '#115798');
        }, function () {
          $(this).css('color', 'black');
        });
        fileupload.init();
      });
    }
  });
});