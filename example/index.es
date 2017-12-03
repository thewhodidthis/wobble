if (window !== window.top) {
  document.documentElement.classList.add('is-iframe')
}

const canvas = document.querySelector('canvas')
const master = canvas.getContext('2d')
const camera = document.createElement('video')

'playsinline loop muted'.split(' ').forEach((v) => {
  camera.setAttribute(v, true)
})

camera.addEventListener('loadedmetadata', ({ target }) => {
  const { videoWidth, videoHeight } = target

  Object.assign(camera, { width: videoWidth, height: videoHeight })
})

camera.setAttribute('src', 'BigBuckBunny.mp4')
canvas.parentNode.insertBefore(camera, canvas)

const worker = new Worker('worker.js')

worker.addEventListener('message', ({ data }) => {
  master.putImageData(data.result, 0, 0)
})

const { width: w, height: h } = canvas

const shadow = canvas.cloneNode().getContext('2d')
const buffer = (source, target) => {
  target.drawImage(source, 0, 0, w, h)

  return target.getImageData(0, 0, w, h)
}

const lineup = fn => window.requestAnimationFrame(fn)
const repeat = () => {
  if (!camera.paused) {
    worker.postMessage({ source: buffer(camera, shadow) })
    lineup(repeat)
  }
}

const figure = document.querySelector('figure')
const button = document.querySelector('a')

'touchstart mousedown'.split(' ').forEach((type) => {
  button.addEventListener(type, () => {
    if (camera.paused) {
      camera.play().then(() => {
        lineup(repeat)
      }).catch(console.log)
    } else {
      camera.pause()
    }

    figure.classList.toggle('is-playing')
  })
})
