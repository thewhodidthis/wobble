// # Slit scan thing

// Feeds on just the number of chunks or divisions (resolution),
// returns a lambda for processing each data frame
const wobble = (lines = 40) => {
  // For caching consecutive frames
  const store = []

  // Accepts and returns an `ImageData` like object of which,
  // `data` of type `Uint8ClampedArray` is the only required property
  return (input = { data: [] }) => {
    // The typed array that gets processed
    const frame = new Uint8ClampedArray(input.data.buffer)

    // Copy input data
    const clone = new Uint8ClampedArray(frame)

    // Store input data
    const storeSizeMaybe = store.push(clone)

    // Limit store size within resolution
    if (lines - storeSizeMaybe < 0) {
      store.shift()
    }

    // Because store fills up gradually up to line count
    const storeSize = store.length
    const frameSize = frame.length

    const chunkSize = Math.floor(frameSize / storeSize)

    // Avoid using forEach, because speed matters in this case
    for (let i = 0; i < storeSize; i += 1) {
      const a = i * chunkSize
      const b = a + chunkSize

      const block = store[i]
      const chunk = block.subarray(a, b)

      frame.set(chunk, a)
    }

    return input
  }
}

export default wobble
