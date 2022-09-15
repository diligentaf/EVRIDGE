const express = require('express')
const transferRoutes = require('./transfers')

const router = express.Router()

router.use('/transfers', transferRoutes)

module.exports = router
