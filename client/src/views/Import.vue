<template>
  <div class="page-content">
    Importing $OSMO to Metamask 🦊
  </div>
</template>

<script>
import { loadingStates } from '../mixins/loading-state'
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
        const wasAdded = await this.$ethereum.request({
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
  },
  mounted() {
    this.importToken()
  },
}
</script>

<style>

</style>
