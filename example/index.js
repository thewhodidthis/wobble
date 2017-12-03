(function () {
'use strict';

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe');
}

var canvas = document.querySelector('canvas');
var master = canvas.getContext('2d');
var camera = document.createElement('video');

'playsinline loop muted'.split(' ').forEach(function (v) {
  camera.setAttribute(v, true);
});

camera.addEventListener('loadedmetadata', function (ref) {
  var target = ref.target;

  var videoWidth = target.videoWidth;
  var videoHeight = target.videoHeight;

  Object.assign(camera, { width: videoWidth, height: videoHeight });
});

camera.setAttribute('src', 'BigBuckBunny.mp4');
canvas.parentNode.insertBefore(camera, canvas);

var worker = new Worker('worker.js');

worker.addEventListener('message', function (ref) {
  var data = ref.data;

  master.putImageData(data.result, 0, 0);
});

var w = canvas.width;
var h = canvas.height;

var shadow = canvas.cloneNode().getContext('2d');
var buffer = function (source, target) {
  target.drawImage(source, 0, 0, w, h);

  return target.getImageData(0, 0, w, h)
};

var lineup = function (fn) { return window.requestAnimationFrame(fn); };
var repeat = function () {
  if (!camera.paused) {
    worker.postMessage({ source: buffer(camera, shadow) });
    lineup(repeat);
  }
};

var figure = document.querySelector('figure');
var button = document.querySelector('a');

'touchstart mousedown'.split(' ').forEach(function (type) {
  button.addEventListener(type, function () {
    if (camera.paused) {
      camera.play().then(function () {
        lineup(repeat);
      }).catch(console.log);
    } else {
      camera.pause();
    }

    figure.classList.toggle('is-playing');
  });
});

}());

