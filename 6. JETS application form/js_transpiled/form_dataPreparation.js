define(['jquery', 'model/session', 'file_upload', 'api_config', "core-js/modules/es6.array.find", "core-js/modules/es6.promise", "core-js/modules/es6.object.to-string", "regenerator-runtime/runtime", '_asyncToGenerator'], function ($, Session, fileupload, api_config, _es6Array, _es, _es6Object, _runtime, _asyncToGenerator) {
  return (
    /*#__PURE__*/
    _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        var form_data, _success, i;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                form_data = {};
                _success = false;
                _context3.next = 4;
                return new Promise(function (resolve, reject) {
                  $('.sections').each(
                    /*#__PURE__*/
                    function () {
                      var _ref2 = _asyncToGenerator(
                        /*#__PURE__*/
                        regeneratorRuntime.mark(function _callee(index) {
                          var section, main_key;
                          return regeneratorRuntime.wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  section = $(this);
                                  main_key = section.attr('id');
                                  form_data[main_key] = {};
                                  _context.next = 5;
                                  return new Promise(function (resolve, reject) {
                                    section.find('input, select').each(function (index) {
                                      key = $(this).attr('name');

                                      if ($(this).is('[type=checkbox]')) {
                                        form_data[main_key][key] = form_data[main_key][key] || [];
                                        $(this).prop('checked') ? form_data[main_key][key].push($(this).val()) : null;
                                      } else if ($(this).is('[type=radio]')) {
                                        form_data[main_key][key] = form_data[main_key][key] || '';
                                        $(this).prop('checked') ? form_data[main_key][key] = $(this).val() : null;
                                      } else if ($(this).is('[type=file]')) {
                                        form_data[main_key][key] = fileupload.uploadData[key];
                                      } else {
                                        form_data[main_key][key] = $(this).val();
                                      }

                                      if (index == section.find('input, select').length - 1) {
                                        resolve();
                                      }
                                    });
                                  });

                                case 5:
                                  if (index == $('.sections').length - 1) {
                                    resolve();
                                  }

                                case 6:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _callee, this);
                        }));

                      return function (_x) {
                        return _ref2.apply(this, arguments);
                      };
                    }());
                });

              case 4:
                form_data["tertiary_education"] = [form_data["tertiary_education"]];
                form_data["working_exp"] = [form_data["working_exp"]];
                form_data['token'] = Session.get('applicationtoken');
                console.log(JSON.stringify(form_data));
                i = 0;

              case 9:
                if (!(i < 2 && !_success)) {
                  _context3.next = 15;
                  break;
                }

                _context3.next = 12;
                return new Promise(function (resolve, reject) {
                  $.ajax({
                    type: 'POST',
                    data: JSON.stringify(form_data),
                    contentType: 'application/json',
                    url: api_config.protocol + api_config.domain + api_config.path + "application",
                    success: function () {
                      var _success2 = _asyncToGenerator(
                        /*#__PURE__*/
                        regeneratorRuntime.mark(function _callee2(data) {
                          return regeneratorRuntime.wrap(function _callee2$(_context2) {
                            while (1) {
                              switch (_context2.prev = _context2.next) {
                                case 0:
                                  if (!(data.result_code != 2)) {
                                    _context2.next = 10;
                                    break;
                                  }

                                  if (!(data.result_code == -9 || data.result_code == -10)) {
                                    _context2.next = 7;
                                    break;
                                  }

                                  _context2.next = 4;
                                  return Session.update();

                                case 4:
                                  _success = _context2.sent;
                                  _context2.next = 8;
                                  break;

                                case 7:
                                  _success = false;

                                case 8:
                                  _context2.next = 11;
                                  break;

                                case 10:
                                  _success = true;

                                case 11:
                                  resolve();

                                case 12:
                                case "end":
                                  return _context2.stop();
                              }
                            }
                          }, _callee2);
                        }));

                      function success(_x2) {
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

              case 12:
                i++;
                _context3.next = 9;
                break;

              case 15:
                return _context3.abrupt("return", _success);

              case 16:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))
  );
});