importScripts("./wobble.js")

const filter = wobble(100)

self.addEventListener("message", ({ data }) => {
  self.postMessage({ result: filter(data?.source) })
})
