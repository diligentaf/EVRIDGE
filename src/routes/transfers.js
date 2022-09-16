const express = require('express')
const { transferController } = require('../controllers/index')

const router = express.Router()

router.get('/', transferController.index)

router.get('/:transferID', transferController.indexByID)

router.post('/transferKeplrToMetamask', transferController.transferKeplrToMetamask)

router.post('/transferMetamaskToKeplr', transferController.transferMetamaskToKeplr)

router.get('/:id', transferController.show)

module.exports = router
