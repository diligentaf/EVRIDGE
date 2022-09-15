const { Transfer } = require('../database/models')
const trunks = require('trunks-log')
const { ethers } = require('hardhat')

const log = new trunks('TRANSFERS')

const transferKeplrToMetamask = async (req, res) => {
  const transfer = new Transfer(req.body)
  let file = require('../data/secret.json')

  var privateKey = file.privateKey
  let receiverAddress = transfer.metamaskAddress
  let contractAddress = '0x81b4871bbf28bf72a93c904f19d5f3e21be276e1'
  let TokenJson = require('../artifacts/contracts/Token.sol/Token.json')
  const provider = new ethers.providers.JsonRpcProvider(
    'https://eth.bd.evmos.org:8545'
  )
  var validator = new ethers.Wallet(privateKey, provider)

  let Token = new ethers.Contract(contractAddress, TokenJson.abi, provider)
  let tx = {
    gasPrice: ethers.utils.parseUnits("1", "gwei"),
    gasLimit: 1000000
  }
  await Token.connect(validator).transfer(receiverAddress, String(ethers.utils.parseEther(transfer.amount))).then(function (txObj) {
        tx = txObj
      })
  await tx.wait()

  try {
    const createdTransfer = await transfer.save()

    res.status(201).json({ transfer: createdTransfer })
  } catch (error) {
    log.error(error, 'Error creating transfer: {}', transfer.email)
    let errStatus = error.name === 'ValidationError' ? 400 : 500
    res.status(errStatus).json({ error })
  }
}

const indexByID = async (req, res) => {
  try {
    const transfer = await Transfer.findOne({
      transferID: req.params.transferID,
    }).exec()

    res.status(200).json({ transfer })
  } catch (error) {
    log.error(error, 'Could not find transfer: {}', req.params.transferID)
    res.status(500).json({ error })
  }
}

const index = async (_req, res) => {
  try {
    const transfers = await Transfer.find().exec()

    res.json({ transfers })
  } catch (error) {
    log.error(error, 'Could not retrieve transfers: {}', error.message)
    res
      .json({ error: error, message: 'Could not retrieve transfers' })
      .status(500)
  }
}

const show = async (req, res) => {
  try {
    console.log('request to show')
    const transfer = await Transfer.findById(req.params.id).exec()

    res.status(200).json({ transfer })
  } catch (error) {
    log.error(error, 'Could not find transfer: {}', req.params.id)
    res.status(500).json({ error })
  }
}

module.exports = {
  transferKeplrToMetamask,
  indexByID,
  index,
  show,
}
