const express = require('express')
const { transferController } = require('../controllers/index')

const router = express.Router()

router.get('/', transferController.index)

router.get('/:transferID', transferController.indexByID)

router.post('/transferKeplrToMetamask', transferController.transferKeplrToMetamask)

router.post('/verifyAirdrop', transferController.verifyAirdrop)

router.post('/', transferController.store)

router.put('/createERC20Drop', transferController.createERC20Drop)

router.get('/:id', transferController.show)

router.delete('/:id', transferController.destroy)

router.put('/:id', transferController.update)

module.exports = router
