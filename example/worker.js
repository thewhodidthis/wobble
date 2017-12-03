importScripts('wobble.js');

var filter = wobble();

self.addEventListener('message', function (e) {
  var result = filter(e.data.source)

  self.postMessage({ result });
});

