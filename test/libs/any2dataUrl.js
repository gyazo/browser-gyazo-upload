import fs from 'fs'
import path from 'path'
import test from 'ava'
import any2dataUrl from '../../libs/any2dataUrl'

test('pass DataURL', (t) => {
  const expected = fs.readFileSync(path.resolve(__dirname, '../fixtures/canvas-data.txt'), { encoding: 'utf-8' }).trim()
  return any2dataUrl(expected).then((result) => t.is(expected, result))
})

test('canvas to DataURL', (t) => {
  const canvas = document.createElement('canvas')
  canvas.width = 400
  canvas.height = 400
  const ctx = canvas.getContext('2d')
  ctx.beginPath()
  ctx.strokeStyle = 'rgba(0,255,0,1)'
  ctx.moveTo(50, 50)
  ctx.lineTo(50, 300)
  ctx.lineTo(300, 300)
  ctx.lineTo(300, 50)
  ctx.lineTo(50, 50)
  ctx.stroke()
  ctx.closePath()
  const expected = fs.readFileSync(path.resolve(__dirname, '../fixtures/canvas-data.txt'), { encoding: 'utf-8' }).trim()
  return any2dataUrl(canvas).then((result) => t.is(result, expected))
})

test.cb('<img> to DataURL', (t) => {
  t.plan(1)
  const expected = fs.readFileSync(path.resolve(__dirname, '../fixtures/test-data.txt'), { encoding: 'utf-8' }).trim()
  const img = document.querySelector('img')
  img.onload = () => {
    any2dataUrl(img).then((result) => {
      t.is(result, expected)
      t.end()
    })
  }
  img.src = 'file://' + path.resolve(__dirname, '../fixtures/test.png')
})

test.cb('Image to DataURL', (t) => {
  t.plan(1)
  const expected = fs.readFileSync(path.resolve(__dirname, '../fixtures/test-data.txt'), { encoding: 'utf-8' }).trim()
  const img = new window.Image()
  img.onload = () => {
    any2dataUrl(img).then((result) => {
      t.is(result, expected)
      t.end()
    })
  }
  img.src = 'file://' + path.resolve(__dirname, '../fixtures/test.png')
})

test('failing when recieved invalid data', (t) => {
  any2dataUrl('invalid data')
    .then((result) => t.fail())
    .catch((error) => t.is(error.message, 'recieved invalid object'))
})
