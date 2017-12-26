importScripts('filter.js');

const filter = wobble(90);

self.addEventListener('message', (e) => {
  self.postMessage({
    result: filter(e.data.source)
  });
});
