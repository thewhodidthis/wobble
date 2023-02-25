## about

Helps create Web Worker friendly pixel bending psychedelia.

## setup

Load via script tag:

```html
<!-- Just an IIFE namespaced `wobble` -->
<script src="https://thewhodidthis.github.io/wobble/wobble.js"></script>
```

Source from an import map:

```json
{
  "imports": {
    "wobble": "https://thewhodidthis.github.io/wobble/main.js"
  }
}
```

Download from GitHub directly if using a package manager:

```sh
# Add to package.json
npm install thewhodidthis/wobble
```

## usage

Set the resolution or number of strips (40 by default) when first calling to create a filter that accepts and returns an `ImageData` like object, of which `data` of type `Uint8ClampedArray` is the only required property. Link it up to a webcam feed and draw the result on canvas for example,

```js
import bender from "https://thewhodidthis.github.io/wobble/main.js"

const canvas = document.createElement("canvas")
const master = canvas.getContext("2d")

const { width, height } = canvas

const camera = document.createElement("video")

if (navigator.mediaDevices) {
  navigator.mediaDevices.getUserMedia({
    video: { width },
    audio: false,
  }).then((stream) => {
    camera.srcObject = stream
  }).catch(console.log)
}

const filter = bender(50)
const buffer = canvas.cloneNode().getContext("2d")

const repeat = () => {
  buffer.drawImage(camera, 0, 0)

  const source = buffer.getImageData(0, 0, width, height)
  const result = filter(source)

  master.putImageData(result, 0, 0)

  window.requestAnimationFrame(repeat)
}

document.body.appendChild(canvas)

document.addEventListener("click", (e) => {
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
