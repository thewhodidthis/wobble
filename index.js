'use strict';

const wobble = (cuts = 40) => {
  const supply = [];

  return ({ height: h, width: w, data } = new ImageData(1, 1)) => {
    const frames = supply.push(data);
    const excess = frames - cuts;

    if (excess) {
      supply.splice(0, excess);
    }

    const pixels = 4 * w * h;
    const slices = supply.length;
    const spread = Math.floor(pixels / slices);

    const lookup = new Uint8ClampedArray(pixels);
    const result = new ImageData(lookup, w, h);

    for (let i = 0; i < slices; i += 1) {
      const begin = i * spread;
      const until = Math.max(begin * 2, pixels);

      const frame = supply[i];
      const chunk = frame.subarray(begin, until);

      lookup.set(chunk, begin);
    }

    return result
  }
};

module.exports = wobble;
