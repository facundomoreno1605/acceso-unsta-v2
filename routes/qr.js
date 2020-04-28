const express = require('express')
const router = express.Router()
const config = require('config')
const qrcode = require('qrcode')
const Person = require('../models/Person')
const Qr = require('../models/Qr')
const Access = require('../models/Access')

router.post('/alumnos', async(req, res) => {
    let {error} = Person.validateInputAlumno(req.body)
    if(error) return res.status(400).send(error)

    var alumno = await Person.findOne({code: req.body.code})
    if(!alumno) {
        alumno = await Person.create({
            name: req.body.name,
            last_name: req.body.last_name,
            code: req.body.code,
            career: req.body.career,
            type: config.get('person.type.ALUMNO')
        })
    }

    var qr = await Qr.getActive(alumno._id)
    if(!qr){
        qr = new Qr();
        qr.person_id = alumno._id,
        qr.code = await qrcode.toDataURL(String(qr._id))
        await qr.save()

        qr.setExpirationTime()
    }


    res.send({
        code: qr.code
    })
})

router.post('/profesores', async(req, res) => {
    let {error} = Person.validateInputProfesor(req.body)
    if(error) return res.status(400).send(error)

    var profesor = await Person.findOne({code: req.body.code})
    if(!profesor) {
        profesor = await Person.create({
            name: req.body.name,
            last_name: req.body.last_name,
            code: req.body.code,
            type: config.get('person.type.PROFESOR')
        })
    }

    var qr = await Qr.getActive(profesor._id)
    if(!qr){
        qr = new Qr();
        qr.person_id = profesor._id,
        qr.code = await qrcode.toDataURL(String(qr._id))
        await qr.save()

        qr.setExpirationTime()
    }

    res.send({
        code: qr.code
    })
})

router.post('/validate', async(req, res) => {
    let {error} = Qr.validateInput(req.body)
    if(error) return res.status(400).send(error)

    let qr = await Qr.isValid(req.body.code)
    if(!qr) {
        return res.status(400).send({ error: 'Codigo invalido.'})
    }

    let person = await Person.findOne({ _id: qr.person_id })

    qr.status = config.get('qr.status.ACEPTADO')
    qr.save()

    await Access.create({
        person: person,
        movement: req.body.movement,
        type: config.get('access.type.PEATON')
    })

    res.send({
        message: 'Acceso concedido.'
    })
})

module.exports = router