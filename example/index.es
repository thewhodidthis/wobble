if (window !== window.top) {
  document.documentElement.classList.add('is-iframe')
}

const figure = document.querySelector('figure')
const canvas = document.querySelector('canvas')
const master = canvas.getContext('2d')
const camera = document.createElement('video')

// In case webcam stream not accessible
const revert = () => {
  'playsinline loop muted'.split(' ').forEach((v) => {
    camera.setAttribute(v, v)
  })

  camera.setAttribute('preload', 'auto')
  camera.setAttribute('src', 'footage.mp4')

  canvas.parentNode.insertBefore(camera, canvas)
  figure.classList.add('is-mobile')
}

if (navigator.mediaDevices) {
  navigator.mediaDevices.getUserMedia({
    video: { width: 640 },
    audio: false
  }).then((stream) => {
    camera.srcObject = stream
  }).catch(revert)
} else {
  revert()
}

const { width: w, height: h } = canvas
const screen = { x: 0, y: 0, w, h }

// Extract dimensions
camera.addEventListener('loadeddata', ({ target }) => {
  const { videoWidth: sw, videoHeight: sh } = target

  const dx = sw - w
  const dy = sh - h

  screen.x -= 0.5 * dx
  screen.y -= 0.5 * dy

  screen.w += dx
  screen.h += dy

  Object.assign(camera, { width: sw, height: sh })
})

const shadow = canvas.cloneNode().getContext('2d')

const buffer = (source, target) => {
  target.drawImage(source, 0, 0, screen.w, screen.h, screen.x, screen.y, screen.w, screen.h)

  return target.getImageData(0, 0, w, h)
}

const worker = new Worker('worker.js')

const lineup = fn => window.requestAnimationFrame(fn)
const repeat = () => {
  if (camera.paused) {
    return
  }

  worker.postMessage({ source: buffer(camera, shadow) })
}

worker.addEventListener('message', ({ data }) => {
  master.putImageData(data.result, 0, 0)

  lineup(repeat)
})

document.querySelector('a').addEventListener('click', (e) => {
  e.preventDefault()

  if (camera.paused) {
    camera.play().then(() => {
      lineup(repeat)
    }).catch(console.log)
  } else {
    camera.pause()
  }

  figure.classList.toggle('is-active')
})
