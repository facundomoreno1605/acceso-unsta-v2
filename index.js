const express = require('express')
const app = express()
require('express-async-errors')

const config = require('./utils/configurations')

require('./startup/error_log')()
require('./startup/db')()
require('./startup/joi')()
require('./startup/production')(app)
require('./startup/routes')(app)

const port = config.app.getPort()
app.listen(port, () => console.log(`Listening on port: ${port}`))