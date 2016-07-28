export default (anyObject) => new Promise((resolve, reject) => {
  if (typeof anyObject === 'string' && anyObject.substr(0, 5) === 'data:') {
    resolve(anyObject)
  } else if (anyObject instanceof window.HTMLCanvasElement) {
    resolve(anyObject.toDataURL())
  } else if (anyObject instanceof window.Blob) {
    const fileReader = new window.FileReader()
    fileReader.onload = () => resolve(fileReader.result)
    fileReader.readAsDataURL(anyObject)
  } else if (anyObject instanceof window.HTMLImageElement || anyObject instanceof window.Image) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const width = anyObject.width
    const height = anyObject.height
    canvas.width = width
    canvas.height = height
    ctx.drawImage(anyObject, 0, 0)
    resolve(canvas.toDataURL())
  }
  reject(new Error({message: 'recieved invalid object'}))
})
