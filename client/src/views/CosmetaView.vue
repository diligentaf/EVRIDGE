<template>
  <div class="page-content">
    <v-layout justify-space-between align-content-center column>
      <v-layout justify-space-between align-content-center>
        <h2>Transfer Cosmos Token to Metamask</h2>
      </v-layout>

      <v-card>
        <v-card-title v-if="!loading" color="#FCE4EC" class="bright--text">
          easy af
        </v-card-title>
        <v-card-title v-else color="#FCE4EC" class="bright--text">
          Please be patient ...
          <br />
          <v-progress-linear color="warning" animated buffer-value="0" v-bind:value="progressBar" height="25" stream>
            <strong animated class="primary bright--text">{{ Math.ceil(this.progressBar) }}%</strong>
          </v-progress-linear>
        </v-card-title>

        <v-card-text>
          <v-form>
            <v-text-field v-model="keplrAddress" label="Your Keplr Address" />
            <v-text-field v-model="amount" label="amount" />
            👇 👇 👇 👇
            <br>
            <v-text-field v-model="metamaskAddress" label="Your Metamask Address" />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="success" @click="submit()" :loading="loading">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
import { loadingStates } from '../mixins/loading-state'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import axios from 'axios'

export default {
  name: 'CosmetaPage',
  mixins: [loadingStates],

  components: {
  },

  data: () => ({
    keplrAddress: '',
    metamaskAddress: '0x8Affd961D6CfAE4988BE9E935Ac20873D466444e',
    amount: '',
  }),

  methods: {
    async submit() {
      if (this.metamaskAddress.length !== 42) {
        alert('please insert a proper address')
        return
      }
      this.transferKeplrToMetamask()
    },
    async transferKeplrToMetamask() {
      try {
        const newTransfer = {
          keplrAddress: this.keplrAddress,
          amount: this.amount,
          metamaskAddress: this.metamaskAddress,
        }
      const http = axios.create({
        // baseURL: process.env.VUE_APP_API_URL + '/api/transfers',
        baseURL: process.env.VUE_APP_API_URL + '/api/transfers',
      })
      http.post('/transferKeplrToMetamask', newTransfer)
      this.$emit('success', newTransfer)
      } catch (error) {
        console.error(error)
        // this.$emit('error', { error })
      }
    },
    async connectKeplr() { 
      if (!window.keplr) {
        this.connectKeplr()
      } else {
        const chainId = 'osmosis-1'
        await window.keplr.enable(chainId)
        const offlineSigner = window.keplr.getOfflineSigner(chainId)
        const accounts = await offlineSigner.getAccounts()
        const CosmWasmClient = await SigningCosmWasmClient.connectWithSigner(
          'https://rpc-osmosis.blockapsis.com',
          offlineSigner,
        )
        const balance = await CosmWasmClient.getBalance(
          accounts[0].address,
          'uosmo',
        )
        this.amount = balance.amount / 1000000
        this.keplrAddress = accounts[0].address
      }
    },
    async sendMoney() {
      console.log('sendGassFee')
      // MOOG SendGasFee
      // let gasPrice = await this.provider.getGasPrice()
      // let currentGasPrice = parseInt(gasPrice._hex)

      let receiverAddress = this.publicKey
      let tx = {
        to: receiverAddress,
        value: this.$ethers.utils.parseEther(this.amountInEther),
        // gasPrice: String(currentGasPrice * 1.15),
      }

      try {
        let rtx
        const t = await this.signer.sendTransaction(tx).then((txObj) => {
          console.log('txHash', txObj.hash)
          rtx = txObj
        })
        await rtx.wait(t)
      } catch (err) {
        console.log(err.code)
        if (err.code == 4001) {
          alert('you rejected the transaction 🙈')
          return
        }
      }
    },
  },
  mounted() {
    this.connectKeplr()
  },
}
</script>

<style>

</style>
