const mongoose = require('mongoose')
const config = require('config')
const Joi = require('@hapi/joi')
const qrcode = require('qrcode')

const schema = new mongoose.Schema({
    person_id: {
        type: mongoose.Types.ObjectId,
        index: true,
        required: true
    },
    code:{
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [config.get('qr.status.ACTIVO'), config.get('qr.status.ACEPTADO'), config.get('qr.status.EXPIRADO')],
        default: config.get('qr.status.ACTIVO'),
        index: true,
        required: true
    },
    request_date: {
        type: Date,
        default: Date.now(),
        required: true
    }
})

schema.statics.getActive = async function(person_id) {
    return await Qr.findOne({ person_id: person_id, status: config.get('qr.status.ACTIVO') })
}

schema.methods.setExpirationTime = function(mls = config.get('qr.EXPIRATION_TIME')) {
    setTimeout(() => {
        if(this.status == config.get('qr.status.ACTIVO')) {
            this.status = config.get('qr.status.EXPIRADO')
            this.save()
        }
    }, mls)
}

schema.statics.validateInput = function(data) {
    return Joi.object({
        code: Joi.string().required(),
        movement: Joi.string().valid(config.get('movement.ENTRADA'), config.get('movement.SALIDA')).required()
    }).validate(data, {abortEarly: false})
}

schema.statics.isValid = async function(code) {
    if(!mongoose.Types.ObjectId.isValid(code)) {
        return false
    }
    
    let qr = await Qr.findOne({ _id: code })

    if(!qr || qr.status != config.get('qr.status.ACTIVO')){
        return false
    }

    return qr
}

const Qr = mongoose.model('qrs', schema)

module.exports = Qr