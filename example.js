const canvas = document.querySelector("canvas")
const master = canvas.getContext("2d")
const button = document.querySelector("figure > a")
const camera = document.createElement("video")

"playsinline loop muted".split(" ").forEach((v) => {
  camera.setAttribute(v, v)
})

// In case the webcam stream is unaccessible.
const revert = () => {
  // Fallback video from: pond5.com/stock-footage/44575894/girl-campers-dancing-campsite.html
  camera.setAttribute("src", "clip.mp4")
  camera.setAttribute("preload", "auto")

  // Set poster.
  canvas.setAttribute("style", "background-image: url(screenshot.jpg)")
}

if (window === window.top && navigator.mediaDevices) {
  navigator.mediaDevices.getUserMedia({
    video: { width: 640 },
    audio: false,
  }).then((stream) => {
    camera.srcObject = stream
    button.click()
  }).catch(revert)
} else {
  revert()
}

const { width: w, height: h } = canvas
const screen = { x: 0, y: 0, w, h }

// Extract dimensions.
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

camera.addEventListener("play", () => {
  button.classList.add("pause")
})

camera.addEventListener("pause", () => {
  button.classList.remove("pause")
})

const buffer = canvas.cloneNode().getContext("2d", { willReadFrequently: true })
const worker = new Worker("worker.js")
const repeat = () => {
  if (camera.paused) {
    return
  }

  buffer.drawImage(camera, 0, 0, screen.w, screen.h, screen.x, screen.y, screen.w, screen.h)

  const source = buffer.getImageData(0, 0, w, h)

  worker.postMessage({ source })
}

worker.addEventListener("message", ({ data }) => {
  if (data?.result) {
    master.putImageData(data.result, 0, 0)
  }

  self.requestAnimationFrame(repeat)
})

button.addEventListener("click", function onclick(e) {
  e.stopPropagation()
  e.preventDefault()

  if (camera.paused) {
    camera.play().then(() => {
      self.requestAnimationFrame(repeat)
    }).catch(console.log)
  } else {
    camera.pause()
  }
})
