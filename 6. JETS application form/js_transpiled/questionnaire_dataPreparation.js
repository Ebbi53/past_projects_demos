define(['jquery', 'model/session', 'api_config', "core-js/modules/es6.array.find", "core-js/modules/es6.promise", "core-js/modules/es6.object.to-string", "regenerator-runtime/runtime", '_asyncToGenerator'], function ($, Session, api_config, _es6Array, _es, _es6Object, _runtime, _asyncToGenerator) {
  return (
    /*#__PURE__*/
    _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var form_data, _success, i;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                form_data = {};
                _success = false;
                _context2.next = 4;
                return new Promise(function (resolve, reject) {
                  form_data['questionnaire'] = {};
                  $('#questionnaire').find('input, select').each(function (index) {
                    key = $(this).attr('name');
                    if ($(this).is('[type=checkbox]')) {
                      form_data['questionnaire'][key] = form_data['questionnaire'][key] || [];
                      $(this).prop('checked') ? form_data['questionnaire'][key].push($(this).val()) : null
                    } else {
                      form_data['questionnaire'][key] = form_data['questionnaire'][key] || '';
                      if ($(this).is('[type=radio]')) {
                        $(this).prop('checked') ? form_data['questionnaire'][key] = $(this).val() : null
                      } else if ($(this).is('[type=file]')) {
                        form_data['questionnaire'][key] = fileupload.uploadData[key]
                      } else {
                        form_data['questionnaire'][key] = $(this).val();
                      }
                    }

                    if (index == $('#questionnaire').find('input, select').length - 1) {
                      resolve();
                    }
                  });
                });

              case 4:
                form_data['token'] = Session.get('applicationtoken');
                console.log(JSON.stringify(form_data));
                i = 0;

              case 7:
                if (!(i < 2 && !_success)) {
                  _context2.next = 13;
                  break;
                }

                _context2.next = 10;
                return new Promise(function (resolve, reject) {
                  $.ajax({
                    type: 'POST',
                    data: JSON.stringify(form_data),
                    contentType: 'application/json',
                    url: api_config.protocol + api_config.domain + api_config.path + 'minisurvey',
                    //TODO
                    success: function () {
                      var _success2 = _asyncToGenerator(
                        /*#__PURE__*/
                        regeneratorRuntime.mark(function _callee(data) {
                          return regeneratorRuntime.wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  //TODO
                                  if (data.result_code == 4) {
                                    _success = true;
                                  } else {
                                    _success = false;
                                  }

                                  resolve();

                                case 2:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _callee);
                        }));

                      function success(_x) {
                        return _success2.apply(this, arguments);
                      }

                      return success;
                    }(),
                    fail: function fail() {
                      _success = false;
                      resolve();
                    }
                  });
                });

              case 10:
                i++;
                _context2.next = 7;
                break;

              case 13:
                return _context2.abrupt("return", _success);

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))
  );
});