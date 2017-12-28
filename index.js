'use strict';

// # Wobble
// Slit scan thing

// Set up with number of strips (resolution),
// get a lambda for processing each data frame in return
var wobble = function (lines) {
  if ( lines === void 0 ) lines = 40;

  // For caching consecutive frames
  var store = [];

  // Accepts and returns an `ImageData` like object, of which
  // `data` of type `Uint8ClampedArray` is the only required property
  return function (input) {
    if ( input === void 0 ) input = { data: [] };

    // Wrap input just in case, this is the data view that
    // gets processed in place
    var frame = new Uint8ClampedArray(input.data.buffer);

    // Copy input data, save for later
    var clone = new Uint8ClampedArray(frame);
    var storeSizeMaybe = store.push(clone);

    // Limit store size within resolution
    if (lines - storeSizeMaybe < 0) {
      store.shift();
    }

    // Calculate range in pixels for each strip
    var storeSize = store.length;
    var frameSize = frame.length;

    var chunkSize = Math.floor(frameSize / storeSize);

    // Avoid using forEach, because speed matters in this case
    for (var i = 0; i < storeSize; i += 1) {
      // Chunk start
      var a = i * chunkSize;

      // Chunk end
      var b = a + chunkSize;

      var block = store[i];
      var chunk = block.subarray(a, b);

      frame.set(chunk, a);
    }

    return input
  }
};

module.exports = wobble;

