importScripts('wobble.js')

const filter = wobble.default(100)

self.addEventListener('message', (e) => {
  self.postMessage({
    result: filter(e.data.source)
  })
})
