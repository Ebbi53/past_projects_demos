define(['jquery', 'underscore', 'backbone', 'file_upload', "core-js/modules/es6.promise", "core-js/modules/es6.object.to-string", "core-js/modules/es7.array.includes", "core-js/modules/es6.string.includes", "core-js/modules/es6.array.find", "regenerator-runtime/runtime", '_asyncToGenerator'], function ($, _, Backbone, fileUpload, _es, _es6Object, _es7Array, _es6String, _es6Array, _runtime, _asyncToGenerator) {
  return (
    /*#__PURE__*/
    _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var hasDeclared, highlightField;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                hasDeclared = true;

                highlightField = function highlightField(highlight, tag) {
                  if (highlight) {
                    if ($("label[for=".concat($(tag).attr('id'), "]")).length == 0) {
                      $(tag).parents('.form-group').find('label').addClass('incomplete-label');
                    } else {
                      $("label[for=".concat($(tag).attr('id'), "]")).addClass('incomplete-label');
                    }

                    $(tag).is('select') && $(tag).attr('class').includes('select2') ? $("#select2-".concat($(tag).attr('id'), "-container")).parent().addClass('incomplete-input') : $(tag).addClass('incomplete-input');
                  } else {
                    $(tag).is('select') && $(tag).attr('class').includes('select2') ? $("#select2-".concat($(tag).attr('id'), "-container")).parent().removeClass('incomplete-input') : $(tag).removeClass('incomplete-input');

                    if ($("label[for=".concat($(tag).attr('id'), "]")).length == 0 && !$(tag).parents('.form-group').find('input').hasClass('incomplete-input')) {
                      $(tag).parents('.form-group').find('label').removeClass('incomplete-label');
                    } else {
                      $("label[for=".concat($(tag).attr('id'), "]")).removeClass('incomplete-label');
                    }
                  }
                };

                _context.next = 4;
                return new Promise(function (resolve, reject) {
                  if ($('input[name=accept_declaration]:checked').val() != 'yes') {
                    $('#declaration').find('label').addClass('incomplete-label');
                    hasDeclared = false;
                    resolve();
                  } else {
                    $('#declaration').find('label').removeClass('incomplete-label');
                    $('.compulsory').each(function (index) {
                      if ($(this).is('label')) {
                        if ($("input[name=".concat($(this).attr('for'), "]:checked")).length == 0) {
                          $(this).parents('.form-group').find('label').addClass('incomplete-label');
                        } else {
                          $(this).parents('.form-group').find('label').removeClass('incomplete-label');
                        }
                      } else {
                        if ($(this).attr('type') == 'file') {
                          if (fileUpload.uploadData[$(this).attr('name')] == '') {
                            highlightField(true, this);
                          } else {
                            highlightField(false, this);
                          }
                        } else {
                          if ($(this).val() == '' || $(this).val() == '--') {
                            highlightField(true, this);
                          } else {
                            !$(this).hasClass('invalid') ? highlightField(false, this) : ''; // validFields.push(true);
                          }
                        }
                      }

                      if (index == $('.compulsory').length - 1) {
                        resolve();
                      }
                    });
                  }
                });

              case 4:
                _context.next = 6;
                return new Promise(function (resolve, reject) {
                  $('.sections').each(function (index) {
                    if ($(this).find('[class*=incomplete]').length != 0) {
                      $section_incomplete = $(this);
                      $('.nav-link').each(function () {
                        if ($(this).attr('href') == '#' + $section_incomplete.attr('id')) {
                          $(this).css('color', '#CC0000');
                          $(this).addClass('incomplete_link');
                        }
                      });
                    } else {
                      $section_complete = $(this);
                      $('.nav-link').each(function () {
                        if ($(this).attr('href') == '#' + $section_complete.attr('id')) {
                          $(this).css('color', '');
                          $(this).removeClass('incomplete_link');
                        }
                      });
                    }

                    if (index == $('.sections').length - 1) {
                      resolve();
                    }
                  });
                });

              case 6:
                return _context.abrupt("return", {
                  success: $('[class*=incomplete]').length == 0,
                  hasDeclared: hasDeclared
                });

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))
  );
});