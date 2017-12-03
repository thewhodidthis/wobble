var wobble = (function () {
'use strict';

var wobble = function (cuts) {
  if ( cuts === void 0 ) cuts = 40;

  var supply = [];

  return function (ref) {
    if ( ref === void 0 ) ref = new ImageData(1, 1);
    var h = ref.height;
    var w = ref.width;
    var data = ref.data;

    var frames = supply.push(data);
    var excess = frames - cuts;

    if (excess) {
      supply.splice(0, excess);
    }

    var pixels = 4 * w * h;
    var slices = supply.length;
    var spread = Math.floor(pixels / slices);

    var lookup = new Uint8ClampedArray(pixels);
    var result = new ImageData(lookup, w, h);

    for (var i = 0; i < slices; i += 1) {
      var begin = i * spread;
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

