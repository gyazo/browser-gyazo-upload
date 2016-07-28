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
      .then((json) => json.get_image_url)
  }
  openBrowser (uri) {
    window.open(uri)
  }
  upload (imagedata, body) {
    if (imagedata) this.imagedata = imagedata
    this.setBody(body)
    this.easyAuth().then(this.openBrowser.bind(this))
  }
}
