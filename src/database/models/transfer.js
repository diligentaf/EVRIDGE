const mongoose = require('mongoose')

const definition = {
  keplrAddress: {
    type: String,
    required: false,
  },
  amount: {
    type: String,
    required: false,
  },
  metamaskAddress: {
    type: String,
    required: false,
  },
  direction: {
    type: String,
    required: false,
  },
  keplrExplorer: {
    type: String,
    required: false,
  },
  metamaskExplorer: {
    type: String,
    required: false,
  },
}

const options = {
  timestamps: true,
}

const transferSchema = new mongoose.Schema(definition, options)

module.exports = mongoose.model('transfer', transferSchema)
