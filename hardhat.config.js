require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-truffle5')
require('hardhat-gas-reporter')
const fs = require('fs')

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.5.6',
      },
      {
        version: '0.4.24',
      },
      {
        version: '0.8.7',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.13',
      },
      {
        version: '0.8.0',
      },
    ],
  },
  gasReporter: {
    enabled: false,
    currency: 'USD',
  },
  networks: {
    testnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      gasPrice: 20e9,
      gas: 25e6,
      // accounts: [privateKey]
    },
    mainnet: {
      url: 'https://bsc-dataseed.binance.org/',
      chainId: 56,
      gasPrice: 20e9,
      gas: 25e6,
      // accounts: [privateKey]
    },
    localhost: {
      url: 'http://127.0.0.1:7545',
      // gasPrice: 20e9,
      // gas: 25e6,
    },
  },
  mocha: {
    timeout: 100000000000000,
  },
}
