const mongoose = require('mongoose')
const config = require('../utils/configurations')

module.exports = function() {
    mongoose.connect(config.db.getUri(), config.db.getOptions())
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => {
            console.log(`Error connecting to MongoDB: ${err}`)
            process.exit(1)
        })
}