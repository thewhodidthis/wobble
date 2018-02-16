importScripts('wobble.js')

const filter = wobble(100)

self.addEventListener('message', (e) => {
  self.postMessage({
    result: filter(e.data.source)
  })
})
