(function () {
'use strict';

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe');
}

var figure = document.querySelector('figure');
var canvas = document.querySelector('canvas');
var master = canvas.getContext('2d');
var camera = document.createElement('video');

// In case webcam stream not accessible
var revert = function () {
  'playsinline loop muted'.split(' ').forEach(function (v) {
    camera.setAttribute(v, v);
  });

  camera.setAttribute('preload', 'auto');
  camera.setAttribute('src', 'footage.mp4');

  canvas.parentNode.insertBefore(camera, canvas);
  figure.classList.add('is-mobile');
};

if (navigator.mediaDevices) {
  navigator.mediaDevices.getUserMedia({
    video: { width: 640 },
    audio: false
  }).then(function (stream) {
    camera.srcObject = stream;
  }).catch(revert);
} else {
  revert();
}

var w = canvas.width;
var h = canvas.height;
var screen = { x: 0, y: 0, w: w, h: h };

// Extract dimensions
camera.addEventListener('loadeddata', function (ref) {
  var target = ref.target;

  var vw = target.videoWidth;
  var vh = target.videoHeight;

  var dx = vw - w;
  var dy = vh - h;

  screen.x -= 0.5 * dx;
  screen.y -= 0.5 * dy;

  screen.w += dx;
  screen.h += dy;

  Object.assign(camera, { width: vw, height: vh });
});

var buffer = canvas.cloneNode().getContext('2d');
var worker = new Worker('worker.js');

var repeat = function () {
  if (camera.paused) {
    return
  }

  buffer.drawImage(camera, 0, 0, screen.w, screen.h, screen.x, screen.y, screen.w, screen.h);

  var source = buffer.getImageData(0, 0, w, h);

  worker.postMessage({ source: source });
};

var render = function (e) {
  master.putImageData(e.data.result, 0, 0);
  window.requestAnimationFrame(repeat);
};

worker.addEventListener('message', render);

document.querySelector('a').addEventListener('click', function (e) {
  e.preventDefault();

  var playing = camera.paused ? camera.play() : undefined;

  if (playing === undefined) {
    camera.pause();
  } else {
    playing.then(function () {
      window.requestAnimationFrame(repeat);
    }).catch(console.log);
  }

  figure.classList.toggle('is-active');
});

}());

