'use strict';

const wobble = (fold = 40) => {
  const supply = [];

  return ({ height: h, width: w, data } = new ImageData(1, 1)) => {
    const length = supply.push(data);
    const excess = length - fold;

    if (excess) {
      supply.splice(0, excess);
    }

    const pixels = w * h * 4;
    const spread = Math.floor(h / supply.length);

    const lookup = new Uint8ClampedArray(pixels);
    const result = new ImageData(lookup, w, h);

    for (let i = 0, total = supply.length; i < total; i += 1) {
      const begin = 4 * spread * i * w;
      const until = Math.max(begin * 2, pixels);

      const frame = supply[i];
      const chunk = frame.subarray(begin, until);

      lookup.set(chunk, begin);
    }

    return result
  }
};

module.exports = wobble;
