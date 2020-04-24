const config = require('../utils/configurations')
const helmet = require('helmet')
const compression = require('compression')

module.exports = function(app) {
    if(config.app.getEnvironment() == 'PRODUCTION'){
        app.use(helmet())
        app.use(compression())
        console.log('Production environment')
        return
    }
    console.log('Development environment')
}