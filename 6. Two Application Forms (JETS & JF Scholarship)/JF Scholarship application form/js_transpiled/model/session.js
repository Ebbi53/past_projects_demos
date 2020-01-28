

define(['jquery', 'underscore', 'backbone', "core-js/modules/es6.promise", "core-js/modules/es6.object.to-string", "core-js/modules/web.dom.iterable", "regenerator-runtime/runtime", '_asyncToGenerator', 'api_config'], function ($, _, Backbone, _es, _es6Object, _webDom, _runtime, _asyncToGenerator, api_config) {
    var sessionModel = Backbone.Model.extend({
        url: api_config.protocol + api_config.domain + api_config.path + 'applicationtoken',
        defaults: {
            applicationtoken: '',
            
            
            expire: '',
            result_code: '',
            uuid: '',
            // complete: false
        },
        update: function () {
            var _update = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee2() {
                    var _this = this;

                    var _success, _loop, i;

                    return regeneratorRuntime.wrap(function _callee2$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    _success = false;
                                    _loop =
                                        /*#__PURE__*/
                                        regeneratorRuntime.mark(function _loop(i) {
                                            return regeneratorRuntime.wrap(function _loop$(_context2) {
                                                while (1) {
                                                    switch (_context2.prev = _context2.next) {
                                                        case 0:
                                                            _context2.next = 2;
                                                            return new Promise(function (resolve, reject) {
                                                                _this.fetch({
                                                                    success: function success() {
                                                                        _success = true;
                                                                        resolve();
                                                                    },
                                                                    error: function () {
                                                                        var _error = _asyncToGenerator(
                                                                            /*#__PURE__*/
                                                                            regeneratorRuntime.mark(function _callee() {
                                                                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                                                                    while (1) {
                                                                                        switch (_context.prev = _context.next) {
                                                                                            case 0:
                                                                                                resolve();
                                                                                                console.log('Try ' + i + ': Token renew failed');

                                                                                            case 2:
                                                                                            case "end":
                                                                                                return _context.stop();
                                                                                        }
                                                                                    }
                                                                                }, _callee);
                                                                            }));

                                                                        function error() {
                                                                            return _error.apply(this, arguments);
                                                                        }

                                                                        return error;
                                                                    }()
                                                                });
                                                            });

                                                        case 2:
                                                        case "end":
                                                            return _context2.stop();
                                                    }
                                                }
                                            }, _loop);
                                        });
                                    i = 0;

                                case 3:
                                    if (!(i < 2 && !_success)) {
                                        _context3.next = 8;
                                        break;
                                    }

                                    return _context3.delegateYield(_loop(i), "t0", 5);

                                case 5:
                                    i++;
                                    _context3.next = 3;
                                    break;

                                case 8:
                                    if (!_success) {
                                        _context3.next = 11;
                                        break;
                                    }

                                    Backbone.Events.trigger('showError', 'sessionTimeOut');
                                    return _context3.abrupt("return", true);

                                case 11:
                                    return _context3.abrupt("return", false);

                                case 12:
                                case "end":
                                    return _context3.stop();
                            }
                        }
                    }, _callee2);
                }));

            function update() {
                return _update.apply(this, arguments);
            }

            return update;
        }()
    });
    return new sessionModel();
});