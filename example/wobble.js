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

    var pixels = w * h * 4;
    var lookup = new Uint8ClampedArray(pixels);
    var result = new ImageData(lookup, w, h);

    var length = supply.push(data);
    var excess = length - fold;

    if (excess) {
      supply.splice(0, excess);
    }

    var size = Math.floor(h / supply.length);

    for (var i = 0; i < supply.length; i += 1) {
      var from = supply[i];

      var stop = 4 * size * i * w;
      var till = Math.max(stop * 2, pixels);

      var clip = from.subarray(stop, till);

      lookup.set(clip, stop);
    }

    return result
  }
};

return wobble;

}());

