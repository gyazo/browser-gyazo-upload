import 'whatwg-fetch'
import any2dataUrl from './any2dataUrl'

export default class uploadClient {
  constructor (clientId) {
    if (!clientId) throw new Error('You should set clientId')
    this.clientId = clientId
    this.sendBody = {referer_url: window.location.href}
    this.imagedata = null
    this.host = 'https://upload.gyazo.com'
    this.apiEndPoint = '/api/upload/easy_auth'
  }

  setBody (body) {
    this.sendBody = Object.assign(this.sendBody, body)
  }

  formData () {
    const formData = new window.FormData()
    for (const key in this.sendBody) {
      if (this.sendBody.hasOwnProperty(key)) {
        formData.append(key, this.sendBody[key])
      }
    }
    return formData
  }

  easyAuth (imagedata, body) {
    if (imagedata) this.imagedata = imagedata
    this.setBody(body)
    if (!this.imagedata) throw new Error('imagedata is empty')
    const reqUrl = this.host + this.apiEndPoint
    return any2dataUrl(this.imagedata)
      .then((dataUrl) => {
        this.setBody({client_id: this.clientId, image_url: dataUrl})
        return fetch(reqUrl, {
          method: 'POST',
          body: this.formData()
        })
      })
      .then((res) => res.json())
      .then((json) => new Promise((ok) => {
        const uploadAcceptUrl = json.get_image_url
        const xhr = new XMLHttpRequest()
        xhr.open('GET', uploadAcceptUrl)
        xhr.onreadystatechange = () => {
          const gyazoUrl = xhr.responseURL
          if (!(xhr.readyState === 4 && gyazoUrl)) return
          ok({
            url: gyazoUrl,
            imageId: gyazoUrl.match(/[a-f0-9]{32}/)[0]
          })
        }
        xhr.send()
      }))
  }
  generateFormatFromImageId ({imageId, format}) {
    if (!imageId) throw new Error('You should set imageId')
    const gyazoUrl = 'https://gyazo.com/' + imageId
    switch (format) {
      case 'md':
      case 'markdown':
        return `[![Gyazo](${gyazoUrl}/raw)](${gyazoUrl})`
      case 'html':
      case 'HTML':
        return `<a href='${gyazoUrl}'><img src='${gyazoUrl}/raw' /></a>`
      case 'imageUrl':
      case 'imageURL':
        return gyazoUrl + '/raw'
      case 'url':
      case 'Url':
      case 'URL':
      default:
        return gyazoUrl
    }
  }
  upload (imagedata, body) {
    if (imagedata) this.imagedata = imagedata
    this.setBody(body)
    this.easyAuth()
      .then((json) => {
        return {
          url: this.generateFormatFromImageId({imageId: json.imageId, format: 'url'}),
          imageUrl: this.generateFormatFromImageId({imageId: json.imageId, format: 'imageUrl'}),
          html: this.generateFormatFromImageId({imageId: json.imageId, format: 'html'}),
          markdown: this.generateFormatFromImageId({imageId: json.imageId, format: 'markdown'})
        }
      })
      .then((a) => console.log(a))
  }
}
