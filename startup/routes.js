const express = require('express')
const errors = require('../middleware/errors')

const home = require('../routes/home')
const qr = require('../routes/qr')

module.exports = function(app) {
    app.use(express.json())

    app.use('/api', home)
    app.use('/api/qr', qr)

    app.use(errors)
}