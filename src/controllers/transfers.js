const { Transfer } = require('../database/models')
const trunks = require('trunks-log')
const crypto = require('crypto')
const { ethers } = require('hardhat')
// const fs = require('fs')

const log = new trunks('TRANSFERS')

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

const verifyAirdrop = async (req, res) => {
  // const transfer = new Transfer(req.body)
  let temp = req.body

  // console.log(temp)
  const transfer = await Transfer.findOne({
    transferID: temp.transferID,
  }).exec()

  if (
    transfer.transferID !== temp.transferID ||
    transfer.cosPerNum !== temp.cosPerNum ||
    transfer.dropAddress !== temp.dropAddress ||
    transfer.network !== temp.network
  ) {
    // MOOG : take out client
    return res.status(400).json({ error: 'verification failed' }) // MOOG : add error
  }

  console.log(temp)

  let DropJson = require('../../artifacts/contracts/LinkDropProd.sol/LinkDropProd.json')
  const provider = new ethers.providers.JsonRpcProvider(
    // 'https://polygon-mumbai.infura.io/v3/7618ab0b33ec40548070f4b40444e04f'
    'https://data-seed-prebsc-1-s1.binance.org:8545/'
  )
  var privateKey = transfer.privateKey
  var validator = new ethers.Wallet(privateKey, provider)

  let Drop = new ethers.Contract(temp.dropAddress, DropJson.abi, provider)

  let cpn
  cpn = String(temp.id)
  cpn += String(await Drop.costPerNum())
  cpn += temp.transferID
  const { arrayify, id, hexConcat } = require('ethers/lib/utils')
  let claimerSignature = await validator.signMessage(arrayify(id(cpn)))

  booleanLinks = await Drop.connect(validator).getLinksFromValidator()
  if (booleanLinks[temp.id] == false) {
    await Drop.connect(validator).airdrop(
      temp.id,
      ethers.utils.parseEther(temp.costPerNum),
      temp.wallet,
      claimerSignature
    )
  } else {
    return res
      .status(400)
      .json({ error: 'the link has already been airdropped' }) // MOOG : add error
  }

  try {
    // const createdTransfer = await transfer.save()

    res.status(201).json({ transfer: transfer })
  } catch (error) {
    log.error(error, 'Error verifying airdrop: {}', transfer.transferID)
    let errStatus = error.name === 'ValidationError' ? 400 : 500
    res.status(errStatus).json({ error })
  }
}

const transferKeplrToMetamask = async (req, res) => {
  console.log('server creating privateKey')
  const transfer = new Transfer(req.body)
  console.log(transfer.keplrAddress)
  console.log(transfer.amount)
  console.log(transfer.metamaskAddress)

  // generating validator private key
  var id = crypto.randomBytes(32).toString('hex')
  var privateKey = '0x' + id
  var validator = new ethers.Wallet(privateKey)
  transfer.privateKey = privateKey
  transfer.publicKey = validator.address

  try {
    const createdTransfer = await transfer.save()

    res.status(201).json({ transfer: createdTransfer })
  } catch (error) {
    log.error(error, 'Error creating transfer: {}', transfer.email)
    let errStatus = error.name === 'ValidationError' ? 400 : 500
    res.status(errStatus).json({ error })
  }
}

const createERC20Drop = async (req, res) => {
  console.log('server creating ERC20 Drop')
  const transfer = new Transfer(req.body)

  // let TokenJson = require('../../artifacts/contracts/Token.sol/Token.json')
  let DropJson = require('../../artifacts/contracts/LinkDropProd.sol/LinkDropProd.json')
  const provider = new ethers.providers.JsonRpcProvider(
    // 'https://polygon-mumbai.infura.io/v3/7618ab0b33ec40548070f4b40444e04f'
    'https://data-seed-prebsc-1-s1.binance.org:8545/'
  )
  var privateKey = transfer.privateKey
  var validator = new ethers.Wallet(privateKey, provider)
  const DropFactory = new ethers.ContractFactory(
    DropJson.abi,
    DropJson.bytecode,
    validator
  )
  console.log('deploying contract')
  let Drop
  let gasPrice = await provider.getGasPrice()
  let currentGasPrice = parseInt(gasPrice._hex)
  let gasPriceString =  String(currentGasPrice * 4.00 / 1000000000)
  let te = ethers.utils.parseUnits(gasPriceString, "gwei")
  let tt = await provider.getFeeData()
  // console.log(tt)
  // https://ethereum.stackexchange.com/questions/106797/how-do-you-estimate-the-gas-cost-to-deploy-a-smart-contract-with-ethers-js
  // const deploymentData = Drop.interface.encodeDeploy(
  //   transfer.tokenAddress,
  //   transfer.client,
  //   transfer.duration,
  //   String(ethers.utils.parseEther(transfer.amount)),
  //   transfer.numLink,
  //   transfer.transferID,
  // )
  // const estimatedGas = await ethers.provider.estimateGas({ data: deploymentData });
  const estimatedGas = await ethers.provider.estimateGas(DropFactory.getDeployTransaction(
  // const estimatedGas = await DropFactory.estimateGas(DropFactory.getDeployTransaction(
    transfer.tokenAddress,
    transfer.client,
    transfer.duration,
    String(ethers.utils.parseEther(transfer.amount)),
    transfer.numLink,
    transfer.transferID,
  ).data)
  console.log(String(estimatedGas * 1.1))
  let gp = estimatedGas * 1.1

  let tx = {
    // nonce: ethers.utils.hexlify(txCount),
    // to: recepient,
    // value: purchaseAmount,
    // gasLimit: 540000,
    // gasPrice: ethers.utils.parseUnits("55", "gwei"),
    // gasPrice: estimatedGas * 1.1,
    // gasPrice: ethers.utils.formatUnits(estimatedGas, "gwei"),
    // gasLimit: 21000
    // gasPrice: 20e9,
    // gasPrice: 20e9,
    gasPrice: 15000000000,
    gasLimit: 3000000
  }

  try {
    console.log(0)
    Drop = await DropFactory.deploy(
      transfer.tokenAddress,
      transfer.client,
      transfer.duration,
      String(ethers.utils.parseEther(transfer.amount)),
      transfer.numLink,
      transfer.transferID,
      // { gasPrice: ethers.utils.parseUnits(100, 'gwei') "100000000000"}
      // { gasPrice: "100000000000"} // 100
      // { gas: "30000000000"} // 100
      // {
      //   gasPrice: "25000000000",
      //   gasLimit: "30000000000"
      // }
      tx
    )
    console.log(1)
    console.log(await Drop.deployTransaction.wait())
    console.log(2)
    console.log('contract deployed')
    req.body.dropAddress = Drop.address
    req.body.costPerNum = ethers.utils.formatEther(
      String(await Drop.costPerNum())
    )
  } catch (error) {
    log.error(error, 'Error creating contract: {}', transfer)
    let errStatus = error.name === 'ValidationError' ? 400 : 500
    res.status(errStatus).json({ error })
  }

  let tnum = 0
  for (var i = 0; i < transfer.numLink; i++) {
    let tx = {
      // gas required exceeds allowance (9370)\14
      gasPrice: ethers.utils.parseUnits("14", "gwei"),
      gasLimit: 1000000
    }
    await Drop.connect(validator)
      .addLink()
      .then(function (txObj) {
        // MOOG debugging (turn this off later)
        console.log(txObj)
        tx = txObj
      })
      await tx.wait()
      console.log(++tnum)
  }

  try {
    const transfer = await Transfer.findOneAndUpdate(
      { transferID: req.body.transferID },
      req.body,
      {
        new: true,
      }
    ).exec()

    res.status(200).json({ transfer })
  } catch (error) {
    log.error(error, 'Error creating transfer: {}', transfer.email)
    let errStatus = error.name === 'ValidationError' ? 400 : 500
    res.status(errStatus).json({ error })
  }
}

const store = async (req, res) => {
  const transfer = new Transfer(req.body)

  // let TokenJson = require('../../artifacts/contracts/Token.sol/Token.json')
  let DropJson = require('../../artifacts/contracts/LinkDropProd.sol/LinkDropProd.json')

  const provider = new ethers.providers.JsonRpcProvider(
    // 'https://polygon-mumbai.infura.io/v3/7618ab0b33ec40548070f4b40444e04f'
    'https://data-seed-prebsc-1-s1.binance.org:8545/'
  )
  var privateKey =
    '0x272da1e8578f89cc8064c7b3b6722f5e537984df04cb0450e303678d457ccf68'
  var validator = new ethers.Wallet(privateKey, provider)
  // const TokenFactory = new ethers.ContractFactory(
  //   TokenJson.abi,
  //   TokenJson.bytecode,
  //   validator
  // )
  // const Token = await TokenFactory.deploy()
  // await Token.deployTransaction.wait()
  // transfer.tokenAddress = Token.address

  const DropFactory = new ethers.ContractFactory(
    DropJson.abi,
    DropJson.bytecode,
    validator
  )

  const Drop = await DropFactory.deploy(
    '0x7Ce269E2489075a6D4C95c967CFA180f34F17840',
    transfer.client,
    transfer.duration,
    transfer.amount,
    transfer.numLink,
    transfer.transferID
  )
  await Drop.deployTransaction.wait()
  transfer.dropAddress = Drop.address

  for (var i = 0; i < transfer.numLink; i++) {
    await Drop.connect(validator)
      .addLink()
      .then(function (tx) {
        // MOOG debugging (turn this off later)
        console.log(tx)
      })
  }

  // var clientKey =
  //   '0x272da1e8578f89cc8064c7b3b6722f5e537984df04cb0450e303678d457ccf68'
  // var client = new ethers.Wallet(clientKey, provider)
  // var links = await Drop.connect(client).getLinks()
  // console.log(links)

  // // checking the connection
  // const name = await Token.name()
  // const symbol = await Token.symbol()
  // const totalSupply = await Token.totalSupply()
  // console.log(`Name: ${name}`)
  // console.log(`Symbol: ${symbol}`)
  // console.log(`Total Supply: ${totalSupply}\n`)

  try {
    const createdTransfer = await transfer.save()

    res.status(201).json({ transfer: createdTransfer })
  } catch (error) {
    log.error(error, 'Error creating transfer: {}', transfer.email)
    let errStatus = error.name === 'ValidationError' ? 400 : 500
    res.status(errStatus).json({ error })
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

const destroy = async (req, res) => {
  try {
    await Transfer.findByIdAndRemove(req.params.id)

    res.status(204).send()
  } catch (error) {
    log.error(error, 'Error finding transfer: {}', req.params.id)
  }
}

const update = async (req, res) => {
  try {
    const transfer = await Transfer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).exec()

    res.status(200).json({ transfer })
  } catch (error) {
    log.error(error, 'Could not update transfer: {}', req.params.id)
    res.status(500).json({ error })
  }
}

module.exports = {
  indexByID,
  index,
  transferKeplrToMetamask,
  store,
  show,
  destroy,
  update,
  createERC20Drop,
  verifyAirdrop,
}
