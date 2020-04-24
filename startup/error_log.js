const winston = require('winston')
require('winston-mongodb')
const config = require('../utils/configurations')

const mongo = new winston.transports.MongoDB({
    db: config.db.getUri(),
    options: config.db.getLogOptions(),
    level: 'error'
})

const logger = winston.createLogger({
    transports: [
        mongo,
        new winston.transports.File({
            filename: './error_logs/errors.log',
            level: 'error'
        })
    ],
    exceptionHandlers: [
        mongo,
        new winston.transports.File({
            filename: './error_logs/uncaughts.log',
            level: 'error'
        })
    ]
})

module.exports = function() {
    process.on('uncaughtException', (err) => {
        logger.error(err.message, err)
        console.log(err)
    })

    process.on('unhandledRejection', (err) => {
        logger.error(err.message, err)
        console.log(err)
    })
}

module.exports.logger = logger
