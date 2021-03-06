const figure = document.querySelector("figure")
const canvas = document.querySelector("canvas")
const master = canvas.getContext("2d")
const camera = document.createElement("video")

// In case webcam stream not accessible
const revert = () => {
  "playsinline loop muted".split(" ").forEach((v) => {
    camera.setAttribute(v, v)
  })

  // Fallback video from
  // https://www.pond5.com/stock-footage/44575894/girl-campers-dancing-campsite.html
  camera.setAttribute("src", "clip.mp4")
  camera.setAttribute("preload", "auto")

  // Fallback poster
  canvas.setAttribute("style", "background-image: url(screenshot.jpg)")

  // Remains hidden, just needs to be part of the DOM
  canvas.parentNode.insertBefore(camera, canvas)
}

if (window === window.top && navigator.mediaDevices) {
  navigator.mediaDevices.getUserMedia({
    video: { width: 640 },
    audio: false,
  }).then((stream) => {
    camera.srcObject = stream
  }).catch(revert)
} else {
  revert()
}

const { width: w, height: h } = canvas
const screen = { x: 0, y: 0, w, h }

// Extract dimensions
camera.addEventListener("loadeddata", ({ target }) => {
  const { videoWidth: vw, videoHeight: vh } = target

  const dx = vw - w
  const dy = vh - h

  screen.x -= 0.5 * dx
  screen.y -= 0.5 * dy

  screen.w += dx
  screen.h += dy

  Object.assign(camera, { width: vw, height: vh })
})

const buffer = canvas.cloneNode().getContext("2d")
const worker = new Worker("worker.js")

const repeat = () => {
  if (camera.paused) {
    return
  }

  buffer.drawImage(camera, 0, 0, screen.w, screen.h, screen.x, screen.y, screen.w, screen.h)

  const source = buffer.getImageData(0, 0, w, h)

  worker.postMessage({ source })
}

const render = (e) => {
  master.putImageData(e.data.result, 0, 0)
  window.requestAnimationFrame(repeat)
}

worker.addEventListener("message", render)

document.querySelector("a").addEventListener("click", (e) => {
  e.preventDefault()

  const playing = camera.paused ? camera.play() : undefined

  if (playing === undefined) {
    camera.pause()
  } else {
    playing.then(() => {
      window.requestAnimationFrame(repeat)
    }).catch(console.log)
  }

  figure.classList.toggle("is-active")
})
