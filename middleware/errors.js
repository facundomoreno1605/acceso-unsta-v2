const {logger} = require('../startup/error_log')

module.exports = function(err, req, res, next) {
    if(err) {
        logger.error(err.message, err)
        console.log(err)
        return res.status(500).send(`Internal server error: ${err}`)
    }
    next()
}