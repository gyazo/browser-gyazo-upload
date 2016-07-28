require('babel-register')
global.document = require('jsdom').jsdom('<img>', {features: { FetchExternalResources: ["img"]}})
global.window = document.defaultView
