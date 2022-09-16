<template>
  <div class="page-content">
    <v-layout justify-space-between align-content-center column>
      <SendBox />
      <v-layout justify-space-between align-content-center>
        <h2>Transfer Cosmos Token to Metamask</h2>
      </v-layout>
      <v-card>
        <v-card-title v-if="!loading" color="#FCE4EC" class="bright--text">
          import
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
            <v-text-field type="text" v-model="amount" label="amount" />
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
import { Decimal } from "@cosmjs/math"
import { Bech32Address } from "@keplr-wallet/cosmos"
import axios from 'axios'
import SendBox from '../components/styled-components/SendBox'
import file from '@/data/secret.json'

export default {
  name: 'Import',
  mixins: [loadingStates],

  components: {
    SendBox,
  },

  data: () => ({
    keplrAddress: '',
    metamaskAddress: '',
    amount: '',
    CosmWasmClient: {},
    ChainInfo: {},
  }),

  methods: {
    async submit() {
      this.amount = String(this.amount)
      if (this.metamaskAddress.length !== 42) {
        alert('please insert a proper address')
        return
      }
      await this.transferToBridgeWallet()
      await this.transferKeplrToMetamask()
    },
    async transferToBridgeWallet() {

      this.ChainInfo = {
        rpc: "https://rpc-osmosis.blockapsis.com",
        rest: "https://lcd-osmosis.blockapsis.com",
        chainId: "osmosis-1",
        chainName: "Osmosis",
        stakeCurrency: {
          coinDenom: "OSMO",
          coinMinimalDenom: "uosmo",
          coinDecimals: 6,
          coinGeckoId: "osmosis",
          coinImageUrl: window.location.origin + "/public/assets/tokens/osmosis.svg",
        },
        bip44: {
          coinType: 118,
        },
        bech32Config: Bech32Address.defaultBech32Config("osmo"),
        currencies: [
          {
            coinDenom: "OSMO",
            coinMinimalDenom: "uosmo",
            coinDecimals: 6,
            coinGeckoId: "osmosis",
            coinImageUrl:
              window.location.origin + "/public/assets/tokens/osmosis.svg",
          },
        ],
        feeCurrencies: [
          {
            coinDenom: "OSMO",
            coinMinimalDenom: "uosmo",
            coinDecimals: 6,
            coinGeckoId: "osmosis",
            coinImageUrl:
              window.location.origin + "/public/assets/tokens/osmosis.svg",
          },
        ],
        features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
        explorerUrlToTx: "https://www.mintscan.io/osmosis/txs/{txHash}",
      }

      let accounts, queryHandler 

      if (window["keplr"]) {
        if (window.keplr["experimentalSuggestChain"]) {
          await window.keplr.experimentalSuggestChain(this.ChainInfo)
          await window.keplr.enable(this.ChainInfo.chainId)
          const offlineSigner = await window.getOfflineSigner(this.ChainInfo.chainId)
          this.CosmWasmClient = await SigningCosmWasmClient.connectWithSigner(
            this.ChainInfo.rpc,
            offlineSigner,
            {
              gasPrice: {
                amount: Decimal.fromAtomics("1000", 4),
                denom: this.ChainInfo.currencies[0].coinMinimalDenom,
              },
            },
          )

          accounts = await offlineSigner.getAccounts()

          queryHandler = this.CosmWasmClient.queryClient.wasm.queryContractSmart
          // Gas price
          // gasPrice = GasPrice.fromString("0.002uconst")

          console.log("Wallet connected", {
            offlineSigner: offlineSigner,
            CosmWasmClient: this.CosmWasmClient,
            accounts: accounts,
            chain: this.ChainInfo,
            queryHandler: queryHandler,
            // gasPrice: gasPrice,
          })

          var recipientAddress = file.publicOsmoAddress
          var amount = String(Number(this.amount) * 10**6)
          var memo = "transferring osmo to bridge"

          this.sendTokensTo(recipientAddress, amount, memo)
        } else {
          console.warn(
            "Error accessing experimental features, please update Keplr",
          )
        }
      } else {
        console.warn("Error accessing Keplr, please install Keplr")
      }

    },
    async sendTokensTo(address, amount, memo) {
      try {
        let deliverTxResponse = await this.CosmWasmClient.sendTokens(
          this.keplrAddress,
          address,
          [
            {
              denom: this.ChainInfo.currencies[0].coinMinimalDenom,
              amount: amount,
            },
          ],
          "auto",
          memo,
        )
        console.log("Transaction Response", {
          tx: deliverTxResponse,
        })
      } catch (e) {
        console.warn("Error sending tokens", [e, address])
      }
    },
    async transferKeplrToMetamask() {
      try {
        const newTransfer = {
          keplrAddress: this.keplrAddress,
          amount: this.amount,
          metamaskAddress: this.metamaskAddress,
        }
        const http = axios.create({
          baseURL: process.env.VUE_APP_API_URL + '/api/transfers',
        })
        http.post('/transferKeplrToMetamask', newTransfer)
        this.$emit('success', newTransfer)
      } catch (error) {
        console.error(error)
        this.$emit('error', { error })
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
  async mounted() {
    this.connectKeplr()
  },
}
</script>

<style>

</style>
