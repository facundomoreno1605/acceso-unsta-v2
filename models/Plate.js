const mongoose = require('mongoose')
const Joi = require('@hapi/joi')

const schema = new mongoose.Schema({
    person_id: {
        type: mongoose.Types.ObjectId,
        index: true,
        required: true
    },
    person_code: {
        type: String,
        index: true,
        required: true
    },
    domain: {
        type: String,
        max: 9,
        unique: true,
        index: true,
        required: true
    }
})

schema.statics.validateInput = function(data) {
    return Joi.object({
        person_code: Joi.string().max(255).required(),
        domain: Joi.string().max(9).required(),
    }).validate(data, {abortEarly: false})
}

const Plate = mongoose.model('plates', schema)

module.exports = Plate