const wobble = (fold = 40) => {
  const supply = []

  return ({ height: h, width: w, data } = new ImageData(1, 1)) => {
    const pixels = w * h * 4
    const lookup = new Uint8ClampedArray(pixels)
    const result = new ImageData(lookup, w, h)

    const length = supply.push(data)
    const excess = length - fold

    if (excess) {
      supply.splice(0, excess)
    }

    const size = Math.floor(h / supply.length)

    for (let i = 0; i < supply.length; i += 1) {
      const from = supply[i]

      const stop = 4 * size * i * w
      const till = Math.max(stop * 2, pixels)

      const clip = from.subarray(stop, till)

      lookup.set(clip, stop)
    }

    return result
  }
}

export default wobble
