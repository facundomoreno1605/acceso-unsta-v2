const express = require('express')
const errors = require('../middleware/errors')

const home = require('../routes/home')
const qr = require('../routes/qr')
const plates = require('../routes/plates')

module.exports = function(app) {
    app.use(express.json())

    app.use('/api', home)
    app.use('/api/qr', qr)
    app.use('/api/plates', plates)

    app.use(errors)
}