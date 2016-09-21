import GyazoUpload from '../index'

window.navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  window.navigator.mozGetUserMedia
window.URL = window.URL || window.webkitURL

const videoElm = document.querySelector('video')
const canvas = document.querySelector('canvas')

window.navigator.getUserMedia({video: true, audio: false}, (stream) => {
  const streamUrl = window.URL.createObjectURL(stream)
  videoElm.src = streamUrl
  window.requestAnimationFrame(function video2canvas () {
    canvas.width = videoElm.getBoundingClientRect().width
    canvas.height = videoElm.getBoundingClientRect().height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(videoElm, 0, 0, canvas.width, canvas.height)
    window.requestAnimationFrame(video2canvas)
  })
}, (err) => console.error(err))

document.querySelector('button').addEventListener('click', () => {
  const client = new GyazoUpload('76e7eee216a88e19f68d034d9ab4afe4e9bd92ff38e2347c01fe05c482f55297')
  client.upload(canvas).then((a) => console.log(a))
})
