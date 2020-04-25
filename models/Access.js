const mongoose = require('mongoose') 
const config = require('config')

const schema = new mongoose.Schema({
    person: {
        _id: {
            type: mongoose.Types.ObjectId,
            index: true,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        code: {
            type: String,
            index: true,
            required: true
        }
    },
    date: {
        type: Date,
        default: Date.now(),
        required: true
    },
    movement: {
        type: String,
        enum: [config.get('movement.ENTRADA'), config.get('movement.SALIDA')],
        required: true
    },
    type: {
        type: String,
        enum: [config.get('access.type.PEATON'), config.get('access.type.VEHICULO')],
        required: true
    },
    domain: {
        type: String,
        required: false
    }
    
})

const Access = mongoose.model('accesses', schema)

module.exports = Access