var wobble = (function () {
'use strict';

var wobble = function (fold) {
  if ( fold === void 0 ) fold = 40;

  var supply = [];

  return function (ref) {
    if ( ref === void 0 ) ref = new ImageData(1, 1);
    var h = ref.height;
    var w = ref.width;
    var data = ref.data;

    var length = supply.push(data);
    var excess = length - fold;

    if (excess) {
      supply.splice(0, excess);
    }

    var pixels = w * h * 4;
    var spread = Math.floor(h / supply.length);

    var lookup = new Uint8ClampedArray(pixels);
    var result = new ImageData(lookup, w, h);

    for (var i = 0, total = supply.length; i < total; i += 1) {
      var begin = 4 * spread * i * w;
      var until = Math.max(begin * 2, pixels);

      var frame = supply[i];
      var chunk = frame.subarray(begin, until);

      lookup.set(chunk, begin);
    }

    return result
  }
};

return wobble;

}());

