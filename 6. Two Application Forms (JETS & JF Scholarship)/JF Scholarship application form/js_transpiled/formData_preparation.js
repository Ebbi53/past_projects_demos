define(['jquery', 'model/session', 'file_upload', 'api_config', "core-js/modules/es6.promise", "core-js/modules/es7.array.includes", "core-js/modules/es6.string.includes", "core-js/modules/web.dom.iterable", "core-js/modules/es6.array.iterator", "core-js/modules/es6.object.to-string", "core-js/modules/es6.object.keys", "core-js/modules/es6.array.find", "regenerator-runtime/runtime", '_asyncToGenerator'], function ($, Session, fileUpload, api_config, _es, _es7Array, _es6String, _webDom, _es6Array, _es6Object, _es6Object2, _es6Array2, _runtime, _asyncToGenerator) {
  return (
    /*#__PURE__*/
    _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var form_data, source, other_scholarships, uploaded_files, success, gce_grades, dse_grades, stpm_grades, gceal_grades, ib_grades, other_grades, grade_array, _loop, i;

        return regeneratorRuntime.wrap(function _callee2$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                grade_array = function _ref3(obj) {
                  obj['dse-grades'] = dse_grades;
                  obj['stpm-grades'] = stpm_grades;
                  obj['gceal-grades'] = gceal_grades;
                  obj['gce-grades'] = gce_grades;
                  obj['ib-grades'] = ib_grades;
                  obj['others-grades'] = other_grades;
                };

                form_data = {};
                source = [];
                other_scholarships = [];
                uploaded_files = [];
                success = false;
                gce_grades = ['0', '0', '0', '0'];
                dse_grades = ['0', '0', '0', '0'];
                stpm_grades = ['0', '0', '0'];
                gceal_grades = ['0', '0', '0', '0', '0', '0', '0', '0', '0'];
                ib_grades = '0';
                other_grades = '0';
                $('.sections').each(function () {
                  var section = $(this);
                  var main_key = section.attr('id');
                  var sub_data = {};
                  var key, value;
                  var counter = 0;

                  if (main_key == 'activities') {
                    var temp = [];
                    section.find('.leadership_experience').each(function () {
                      var temp_data = {};
                      $(this).find('input').each(function () {
                        temp_data[$(this).attr('name')] = $(this).val();
                      });
                      temp.push(temp_data);
                    });
                    form_data['activities'] = temp;
                  } else if (main_key == 'uploaded_files') {
                    form_data['cv_upload'] = fileUpload.uploadData;
                    form_data[main_key] = [];

                    for (var _key in fileUpload.uploadData) {
                      form_data[main_key].push({
                        'file': _key,
                        'display_file_name': fileUpload.uploadData[_key]
                      });
                    }
                  } else {
                    section.find('input, select, textarea').each(function () {
                      key = $(this).attr('name');

                      switch (key) {
                        case 'gender':
                          if ($(this).is(':checked')) {
                            value = $(this).val();
                            break;
                          } else break;

                        case 'phone_home':
                          value = $('#home_area_code').val() + ' ' + $('#home_number').val();
                          break;

                        case 'phone_mobile':
                          value = $('#mobile_area_code').val() + ' ' + $('#mobile_number').val();
                          break;

                        case 'referee_telephone':
                          value = $('#referee_area_code').val() + ' ' + $('#referee_telephone').val();
                          break;

                        case 'gce-grades':
                          gce_grades[counter] = $(this).val();
                          counter++;

                          if (counter == 4) {
                            sub_data['acad_type'] = 'gce';
                            value = gce_grades;
                            grade_array(sub_data);
                            counter = 0;
                            break;
                          }

                          break;

                        case 'ib-grades':
                          ib_grades = $(this).val();
                          sub_data['acad_type'] = 'ib';
                          value = ib_grades;
                          grade_array(sub_data);
                          break;

                        case 'dse-grades':
                          dse_grades[counter] = $(this).val();
                          counter++;

                          if (counter == 4) {
                            sub_data['acad_type'] = 'dse';
                            value = dse_grades;
                            grade_array(sub_data);
                            counter = 0;
                            break;
                          }

                          break;

                        case 'stpm-grades':
                          stpm_grades[counter] = $(this).val();
                          counter++;

                          if (counter == 3) {
                            sub_data['acad_type'] = 'stpm';
                            value = stpm_grades;
                            grade_array(sub_data);
                            counter = 0;
                            break;
                          }

                          break;

                        case 'gceal-grades':
                          gceal_grades[counter] = $(this).val();
                          counter++;

                          if (counter == 9) {
                            sub_data['acad_type'] = 'gceal';
                            value = gceal_grades;
                            grade_array(sub_data);
                            counter = 0;
                            break;
                          }

                          break;

                        case 'others-grades':
                          other_grades = $(this).val();
                          sub_data['acad_type'] = 'others';
                          value = other_grades;
                          grade_array(sub_data);
                          break;

                        case 'university_invitation':
                          if ($(this).is(':checked')) {
                            value = $(this).val();
                            break;
                          } else break;

                        case 'source':
                          if ($(this).is(':checked')) {
                            if ($(this).val() == 'Others') {
                              var src = $('input:text[name="specific_of_other_source"]').val();
                              sub_data['specific_of_other_source'] = src;
                            } else {
                              sub_data['specific_of_other_source'] = "";
                            }

                            source.push($(this).val());
                          }

                          value = source;
                          break;

                        case 'sent_email_to_school_principal':
                          if ($(this).is(':checked')) {
                            value = $(this).val();
                            break;
                          } else break;

                        case 'other_scholarship_application':
                          if ($(this).is(':checked')) {
                            if ($(this).val() == 'yes') {
                              value = 'yes';
                              $('.scholarship').each(function () {
                                var scholarship = {};
                                scholarship['scholarship_name'] = $(this).find('.scholarship_name').val();
                                scholarship['scholarship_type'] = $(this).find('.scholarship_type').val();
                                other_scholarships.push(scholarship);
                              });
                              sub_data['name_of_scholarship'] = other_scholarships;
                              break;
                            } else {
                              value = 'no';
                              sub_data['name_of_scholarship'] = [];
                              break;
                            }
                          } else {
                            break;
                          }

                        case '*=name_of_scholarship':
                          break;

                        case '*=type_of_scholarship':
                          break;

                        default:
                          value = $(this).val();
                      }

                      sub_data[key] = value;
                      delete sub_data[""];
                      delete sub_data[undefined];
                      var keys = Object.keys(sub_data);

                      for (var _i = 0, _keys = keys; _i < _keys.length; _i++) {
                        key = _keys[_i];
                        if (key.includes('name_of_scholarship_') || key.includes('type_of_scholarship_')) delete sub_data[key];
                      }
                    });
                    form_data[main_key] = sub_data;
                  }

                  form_data['token'] = Session.get('applicationtoken');
                });
                console.log(form_data);
                _loop =
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _loop(_i2) {
                    return regeneratorRuntime.wrap(function _loop$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return new Promise(function (resolve, reject) {
                              $.ajax({
                                type: 'POST',
                                data: JSON.stringify(form_data),
                                contentType: 'application/json',
                                url: api_config.protocol + api_config.domain + api_config.path + 'application'
                              }).done(
                                /*#__PURE__*/
                                function () {
                                  var _ref2 = _asyncToGenerator(
                                    /*#__PURE__*/
                                    regeneratorRuntime.mark(function _callee(data, textStatus) {
                                      return regeneratorRuntime.wrap(function _callee$(_context) {
                                        while (1) {
                                          switch (_context.prev = _context.next) {
                                            case 0:
                                              if (!(data.result_code != 2)) {
                                                _context.next = 15;
                                                break;
                                              }

                                              if (!(data.result_code == -9 || data.result_code == -10)) {
                                                _context.next = 12;
                                                break;
                                              }

                                              _context.next = 4;
                                              return Session.update();

                                            case 4:
                                              if (!_context.sent) {
                                                _context.next = 8;
                                                break;
                                              }

                                              success = 'Session updated';
                                              _context.next = 9;
                                              break;

                                            case 8:
                                              success = false;

                                            case 9:
                                              _i2++;
                                              _context.next = 13;
                                              break;

                                            case 12:
                                              success = false;

                                            case 13:
                                              _context.next = 16;
                                              break;

                                            case 15:
                                              success = true;

                                            case 16:
                                            case "end":
                                              return _context.stop();
                                          }
                                        }
                                      }, _callee);
                                    }));

                                  return function (_x, _x2) {
                                    return _ref2.apply(this, arguments);
                                  };
                                }()).fail(function (data, textStatus) {
                                  // console.log(textStatus)s
                                  // console.log(data)
                                  success = false;
                                }).always(function (textStatus) {
                                  resolve(); // console.log(textStatus)
                                });
                            });

                          case 2:
                            i = _i2;

                          case 3:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _loop);
                  });
                i = 0;

              case 16:
                if (!(i < 2 && !success)) {
                  _context3.next = 21;
                  break;
                }

                return _context3.delegateYield(_loop(i), "t0", 18);

              case 18:
                i++;
                _context3.next = 16;
                break;

              case 21:
                return _context3.abrupt("return", success);

              case 22:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee2);
      }))
  );
});