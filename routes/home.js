const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('acceso-unsta api')
})

module.exports = router