const mongoose = require('mongoose')
const Joi = require('@hapi/joi')
const config = require('config')

const schema = new mongoose.Schema({
    name: {
        type: String, 
        maxlength: 255,
        required: true,
    },
    last_name: {
        type: String, 
        maxlength: 255,
        required: true,
    },
    code: {
        type: String, 
        maxlength: 255,
        unique: true,
        index: true,
        required: true,
    },
    career: {
        type: String, 
        maxlength: 255,
        required: false,
    },
    type: {
        type: String,
        enum: [config.get('person.type.ALUMNO'), config.get('person.type.PROFESOR')],
        required: true
    }
})

schema.statics.validateInputAlumno = function(data) {
    return Joi.object({
        name: Joi.string().max(255).required(),
        last_name: Joi.string().max(255).required(),
        code: Joi.string().max(255).required(),
        career: Joi.string().max(255).required(),
    }).validate(data, {abortEarly: false})
}

schema.statics.validateInputProfesor = function(data) {
    return Joi.object({
        name: Joi.string().max(255).required(),
        last_name: Joi.string().max(255).required(),
        code: Joi.string().max(255).required(),
    }).validate(data, {abortEarly: false})
}

const Person = mongoose.model('persons', schema)

module.exports = Person