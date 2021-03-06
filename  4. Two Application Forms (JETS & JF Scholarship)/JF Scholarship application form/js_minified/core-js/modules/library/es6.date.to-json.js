define(function (require, exports, module) {'use strict';

var $export = require('./_export');

var toObject = require('./_to-object');

var toPrimitive = require('./_to-primitive');

var toISOString = require('./_date-to-iso-string');

var classof = require('./_classof');

$export($export.P + $export.F * require('./_fails')(function () {
  return new Date(NaN).toJSON() !== null || Date.prototype.toJSON.call({
    toISOString: function () {
      return 1;
    }
  }) !== 1;
}), 'Date', {
  // eslint-disable-next-line no-unused-vars
  toJSON: function toJSON(key) {
    var O = toObject(this);
    var pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : !('toISOString' in O) && classof(O) == 'Date' ? toISOString.call(O) : O.toISOString();
  }
});
});
