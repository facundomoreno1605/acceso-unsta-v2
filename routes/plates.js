const express = require('express')
const router = express.Router()
const Joi = require('@hapi/joi')
const config = require('config')
const Plate = require('../models/Plate')
const Access = require('../models/Access')
const Person = require('../models/Person')

router.post('/alumnos', async(req, res) => {
    let {error} = Joi.object({
        name: Joi.string().max(255).required(),
        last_name: Joi.string().max(255).required(),
        code: Joi.string().max(255).required(),
        career: Joi.string().max(255).required(),
        domain: Joi.string().max(9).required(),
    }).validate(req.body, {abortEarly: false})

    if(error) return res.status(400).send(error)

    var person = await Person.findOne({ code: req.body.code })
    if(!person) {
        person = await Person.create({
            name: req.body.name,
            last_name: req.body.last_name,
            code: req.body.code,
            career: req.body.career,
            type: config.get('person.type.ALUMNO')
        })
    }

    var plate = await Plate.findOne({ domain: req.body.domain })
    if(plate) {
        return res.status(400).send({
            error: `Ya existe una patente cargada con el dominio: ${req.body.domain}`
        })
    }

    var plates = await Plate.find({ person_id: person.id })
    if(plates.length  >= 5) {
        return res.status(400).send({
            error: 'Numero maximo de patentes alcanzado.'
        })
    }



    plate =  await Plate.create({
                    person_id: person,
                    person_code: req.body.code,
                    domain: req.body.domain
                })

    res.send(plate)    
})

router.post('/profesores', async(req, res) => {
    let {error} = Joi.object({
        name: Joi.string().max(255).required(),
        last_name: Joi.string().max(255).required(),
        code: Joi.string().max(255).required(),
        domain: Joi.string().max(9).required(),
    }).validate(req.body, {abortEarly: false})

    if(error) return res.status(400).send(error)

    var person = await Person.findOne({ code: req.body.code })
    if(!person) {
        person = await Person.create({
            name: req.body.name,
            last_name: req.body.last_name,
            code: req.body.code,
            type: config.get('person.type.PROFESOR')
        })
    }

    var plate = await Plate.findOne({ domain: req.body.domain })
    if(plate) {
        return res.status(400).send({
            error: `Ya existe una patente cargada con el dominio: ${req.body.domain}`
        })
    }

    var plates = await Plate.find({ person_id: person.id })
    if(plates.length  >= 5) {
        return res.status(400).send({
            error: 'Numero maximo de patentes alcanzado.'
        })
    }


    plate =  await Plate.create({
                    person_id: person,
                    person_code: req.body.code,
                    domain: req.body.domain
                })

    res.send(plate)    
})

router.delete('/delete', async(req, res) => {
    let {error} = Joi.object({
        code: Joi.string().max(255).required(),
        domain: Joi.string().max(9).required()
    }).validate(req.body, {abortEarly: false})

    if(error) return res.status(400).send(error)

    let person = await Person.findOne({ code: req.body.code })
    if(!person) {
        return res.status(400).send({
            error: 'Persona no encontrada.'
        })
    }

    let plate = await Plate.findOne({ domain: req.body.domain })
    if(!plate){
        return res.status(400).send({
            error: 'Patente no encontrada.'
        })
    } 

    if(String(plate.person_id) != String(person._id)) {
        return res.status(400).send({ error: `La patente no pertenece a la persona` })
    }

    await plate.delete()

    res.send({
        message: 'Patente elminada correctamente.'
    })

})


router.post('/access', async(req, res) => {
    let {error} = Joi.object({
        domain: Joi.string().max(255).required(),
        movement: Joi.string().valid(config.get('movement.ENTRADA'), config.get('movement.SALIDA')).required(),
    }).validate(req.body, {abortEarly: false})
    
    if(error) return res.status(400).send(error)

    let plate = await Plate.findOne({ domain: req.body.domain })
    if(!plate) {
        return res.status(400).send({error: 'Acceso denegado.'})
    }

    let person = await Person.findOne({ _id: plate.person_id })

    await Access.create({
        person: person,
        type: config.get('access.type.VEHICULO'),
        movement: req.body.movement,
        domain: plate.domain
    })

    res.send({ message: 'Acceso concedido.'})
})


router.get('/:code', async (req, res) => {
    let plates = await Plate.find({ person_code: req.params.code })
    if(plates.length == 0) {
        return res.status(400).send({ message: 'No tiene patentes cargadas' })
    }

    res.send(plates)
})

module.exports = router