<template>
  <div class="page-content">
    Importing $OSMO
    <br/>
    Please check your Metamask 🦊
  </div>
</template>

<script>
import { loadingStates } from '../mixins/loading-state'
import web3 from 'web3'
// import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
// import { Decimal } from "@cosmjs/math"
// import { Bech32Address } from "@keplr-wallet/cosmos"
// import axios from 'axios'
// import SendBox from '../components/styled-components/SendBox'
import file from '@/data/secret.json'

export default {
  name: 'Import',
  mixins: [loadingStates],

  components: {
  },

  data: () => ({
  }),

  methods: {
    async importToken() {
      try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20', // Initially only supports ERC20, but eventually more!
            options: {
              address: file.tokenAddress, // The address that the token is at.
              symbol: 'OSMO', // A ticker symbol or shorthand, up to 5 chars.
              decimals: 18, // The number of decimals in the token
            },
          },
        })
        console.log(wasAdded)

        if (wasAdded) {
          console.log('Thanks for your interest!')
        } else {
          console.log('Your loss!')
        }
      } catch (error) {
        console.log(error)
      }

    },
    async changeNetwork() {
      const chainId = 9001 // EVMOS Mainnet

      if (window.ethereum.networkVersion !== chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: web3.utils.toHex(chainId) }],
          })
        } catch (err) {
          // This error code indicates that the chain has not been added to MetaMask
          if (err.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainName: 'Evmos',
                  chainId: web3.utils.toHex(chainId),
                  nativeCurrency: {
                    name: 'EVMOS',
                    decimals: 18,
                    symbol: 'EVMOS',
                  },
                  rpcUrls: ['https://eth.bd.evmos.org:8545/'],
                },
              ],
            })
          }
        }
      }
      this.importToken()
    },
    handleAccountsChanged(accounts) {
      this.metamaskAddress = accounts[0]
      localStorage.setItem('client', this.client)
      this.changeNetwork()
    },
    async connectWallet() {
      if (
        typeof window.ethereum !== 'undefined' &&
        window.ethereum.isMetaMask
      ) {
        await window.ethereum
          .request({ method: 'eth_requestAccounts' })
          .then(this.handleAccountsChanged)
          .catch((err) => {
            if (err.code === 4001) {
              console.log(err.message)
            } else {
              console.error(err)
            }
          })
      } else {
        alert('please install MetaMask')
      }
    },
  },
  async mounted() {
    await this.connectWallet()
  },
}
</script>

<style>

</style>
