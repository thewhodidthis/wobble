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
  camera.setAttribute('src', 'BigBuckBunny.mp4');

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

  var sw = target.videoWidth;
  var sh = target.videoHeight;

  var dx = sw - w;
  var dy = sh - h;

  screen.x -= 0.5 * dx;
  screen.y -= 0.5 * dy;

  screen.w += dx;
  screen.h += dy;

  Object.assign(camera, { width: sw, height: sh });
});

var worker = new Worker('worker.js');

worker.addEventListener('message', function (ref) {
  var data = ref.data;

  master.putImageData(data.result, 0, 0);
});

var shadow = canvas.cloneNode().getContext('2d');

var buffer = function (source, target) {
  target.drawImage(source, 0, 0, screen.w, screen.h, screen.x, screen.y, screen.w, screen.h);

  return target.getImageData(0, 0, w, h)
};

var lineup = function (fn) { return window.requestAnimationFrame(fn); };
var repeat = function () {
  if (camera.paused) {
    return
  }

  worker.postMessage({ source: buffer(camera, shadow) });
  lineup(repeat);
};

var button = document.querySelector('a');

button.addEventListener('click', function (e) {
  e.preventDefault();

  if (camera.paused) {
    camera.play().then(function () {
      lineup(repeat);
    }).catch(console.log);
  } else {
    camera.pause();
  }

  figure.classList.toggle('is-active');
});

}());

