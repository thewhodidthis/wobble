## about

Helps create Web Worker friendly pixel bending psychedelia.

## setup

Download from GitHub directly:

```sh
# Add to package.json
npm install thewhodidthis/wobble
```

## usage

Link up to webcam feed for example,

```js
import bender from '@thewhodidthis/wobble'

const canvas = document.createElement('canvas')
const master = canvas.getContext('2d')

const { width: w, height: h } = canvas

const camera = document.createElement('video')

if (navigator.mediaDevices) {
  navigator.mediaDevices.getUserMedia({
    video: { width: w },
    audio: false
  }).then((stream) => {
    camera.srcObject = stream
  }).catch(console.log)
}

const filter = bender(50)
const buffer = canvas.cloneNode().getContext('2d')

const repeat = () => {
  buffer.drawImage(camera, 0, 0)

  const source = buffer.getImageData(0, 0, w, h)
  const result = filter(source)

  master.putImageData(result, 0, 0)

  window.requestAnimationFrame(repeat)
}

document.body.appendChild(canvas)

document.addEventListener('click', (e) => {
  e.preventDefault()

  if (camera.paused) {
    camera.play().then(() => {
      window.requestAnimationFrame(repeat)
    }).catch(console.log)
  } else {
    camera.pause()
  }
})
```

## see also

- [Informal Catalogue of Slit-Scan Video Artworks and Research](http://www.flong.com/texts/lists/slit_scan)
- [Neil Jenkins' processing sketch](http://www.devoid.co.uk/processing/linearvideo_slitcamera1/index.htm)
