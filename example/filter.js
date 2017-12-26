var wobble = (function () {
'use strict';

// # Slit scan thing

// Feeds on just the number of chunks or divisions (resolution),
// returns a lambda for processing each data frame
var wobble = function (lines) {
  if ( lines === void 0 ) lines = 40;

  // For caching consecutive frames
  var store = [];

  // Accepts and returns an `ImageData` like object of which,
  // `data` of type `Uint8ClampedArray` is the only required property
  return function (input) {
    if ( input === void 0 ) input = { data: [] };

    // The typed array that gets processed
    var frame = new Uint8ClampedArray(input.data.buffer);

    // Copy input data
    var clone = new Uint8ClampedArray(frame);

    // Store input data
    var storeSizeMaybe = store.push(clone);

    // Limit store size within resolution
    if (lines - storeSizeMaybe < 0) {
      store.shift();
    }

    // Because store fills up gradually up to line count
    var storeSize = store.length;
    var frameSize = frame.length;

    var chunkSize = Math.floor(frameSize / storeSize);

    // Avoid using forEach, because speed matters in this case
    for (var i = 0; i < storeSize; i += 1) {
      var a = i * chunkSize;
      var b = a + chunkSize;

      var block = store[i];
      var chunk = block.subarray(a, b);

      frame.set(chunk, a);
    }

    return input
  }
};

return wobble;

}());

