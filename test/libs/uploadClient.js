import fs from 'fs'
import path from 'path'
import test from 'ava'
import fetchMock from 'fetch-mock'
import uploadClient from '../../libs/uploadClient'

const imagedata = fs.readFileSync(path.resolve(__dirname, '../fixtures/test-data.txt'), { encoding: 'utf-8' }).trim()

fetchMock
  .post('https://upload.gyazo.com/api/upload/easy_auth', {
    'get_image_url' : 'https://gyazo.com/api/upload/8980c52421e452ac3355ca3e5cfe7a0c',
    'expires_at' : 1401178164
  })

test('call easy_auth api', (t) => {
  const client = new uploadClient('SAMPLECLIENTID')
  return client.easyAuth(imagedata).then((result) => {
    t.is(result, 'https://gyazo.com/api/upload/8980c52421e452ac3355ca3e5cfe7a0c')
  })
})
