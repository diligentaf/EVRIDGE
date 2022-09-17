<template>
  <div class="page-content">
    <v-layout justify-space-between align-content-center column>
      <Container>
        <TitleBox class="justify-center">🪐Keplr ➡️ 🦊Metamask
          <v-btn class="space" @click="changePage">switch</v-btn>
        </TitleBox>
        <v-select
          v-model="select"
          :items="coins"
          label="Select the Token"
          outlined
        ></v-select>
        <AddressInputBox>
          <AddressInput v-model="keplrAddress" placeholder="Your Keplr Address" />
        </AddressInputBox>
        <AddressInputBox>
          <AddressInput v-model="amount" placeholder="0.0" />
          <CurrencyBox>OSMO $</CurrencyBox>
        </AddressInputBox>
        <div class="d-flex justify-center mb-6">⬇️</div>
        <AddressInputBox>
          <AddressInput v-model="metamaskAddress" placeholder="To Metamask" />
        </AddressInputBox>
        <SubmitButton v-if="submitValid" style="background-color: rgb(33, 114, 229);" @click="submit()" :loading="loading">Submit</SubmitButton>
        <SubmitButton v-else>Submit</SubmitButton>
      </Container>
    </v-layout>
  </div>
</template>

<script>
import { loadingStates } from '../mixins/loading-state'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { Decimal } from '@cosmjs/math'
import { Bech32Address } from '@keplr-wallet/cosmos'
import axios from 'axios'
import {
  Container,
  TitleBox,
  AddressInputBox,
  AddressInput,
  CurrencyBox,
  SubmitButton,
} from '../components/styled-components/SendBox'
import file from '@/data/secret.json'

export default {
  name: 'KeplrToMetamask',
  mixins: [loadingStates],

  components: {
    AddressInput,
    CurrencyBox,
    SubmitButton,
    Container,
    TitleBox,
    AddressInputBox,
  },

  data: () => ({
    keplrAddress: '',
    metamaskAddress: '',
    amount: '',
    CosmWasmClient: {},
    ChainInfo: {},
    submitValid: false,
    select: {text: 'OSMO', value: 'OSMO'},
    coins: [
      {text: 'OSMO', value: 'OSMO'}, 
      {text: 'ATOM (Coming Soon)', value: 'ATOM', disabled: true},
      {text: 'JUNO (Coming Soon)', value: 'JUNO', disabled: true},
      {text: 'CRO (Coming Soon)', value: 'CRO', disabled: true},
      {text: 'OKB (Coming Soon)', value: 'OKB', disabled: true},
      {text: 'RUNE (Coming Soon)', value: 'RUNE', disabled: true},
    ],
    txHash: '',
  }),

  watch: {
    keplrAddress() {
      if (this.keplrAddress && this.metamaskAddress && this.amount) {
          this.submitValid = true
          console.log("true")
      } else {
        this.submitValid = false
      }
    },
    metamaskAddress() {
      if (this.keplrAddress && this.metamaskAddress && this.amount) {
          this.submitValid = true
          console.log("true")
      } else {
        this.submitValid = false
      }
    },
    amount() {
      if (this.keplrAddress && this.metamaskAddress && this.amount) {
          this.submitValid = true
          console.log("true")
      } else {
        this.submitValid = false
      }
    },

  },

  methods: {
    changePage() {
      this.$router.push('/mtk')
    },
    async submit() {
      this.amount = String(this.amount)
      if (this.metamaskAddress.length !== 42) {
        alert('please insert a proper address')
        return
      }
      await this.transferToBridgeWallet()
      if (this.txHash !== '') {
        await this.transferKeplrToMetamask()
      }
    },
    async transferToBridgeWallet() {
      this.ChainInfo = {
        rpc: 'https://rpc-osmosis.blockapsis.com',
        rest: 'https://lcd-osmosis.blockapsis.com',
        chainId: 'osmosis-1',
        chainName: 'Osmosis',
        stakeCurrency: {
          coinDenom: 'OSMO',
          coinMinimalDenom: 'uosmo',
          coinDecimals: 6,
          coinGeckoId: 'osmosis',
          coinImageUrl:
            window.location.origin + '/public/assets/tokens/osmosis.svg',
        },
        bip44: {
          coinType: 118,
        },
        bech32Config: Bech32Address.defaultBech32Config('osmo'),
        currencies: [
          {
            coinDenom: 'OSMO',
            coinMinimalDenom: 'uosmo',
            coinDecimals: 6,
            coinGeckoId: 'osmosis',
            coinImageUrl:
              window.location.origin + '/public/assets/tokens/osmosis.svg',
          },
        ],
        feeCurrencies: [
          {
            coinDenom: 'OSMO',
            coinMinimalDenom: 'uosmo',
            coinDecimals: 6,
            coinGeckoId: 'osmosis',
            coinImageUrl:
              window.location.origin + '/public/assets/tokens/osmosis.svg',
          },
        ],
        features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx', 'ibc-go'],
        explorerUrlToTx: 'https://www.mintscan.io/osmosis/txs/{txHash}',
      }

      let accounts, queryHandler

      if (window['keplr']) {
        if (window.keplr['experimentalSuggestChain']) {
          await window.keplr.experimentalSuggestChain(this.ChainInfo)
          await window.keplr.enable(this.ChainInfo.chainId)
          const offlineSigner = await window.getOfflineSigner(
            this.ChainInfo.chainId,
          )
          this.CosmWasmClient = await SigningCosmWasmClient.connectWithSigner(
            this.ChainInfo.rpc,
            offlineSigner,
            {
              gasPrice: {
                amount: Decimal.fromAtomics('1000', 4),
                denom: this.ChainInfo.currencies[0].coinMinimalDenom,
              },
            },
          )

          accounts = await offlineSigner.getAccounts()

          queryHandler = this.CosmWasmClient.queryClient.wasm.queryContractSmart
          // Gas price
          // gasPrice = GasPrice.fromString("0.002uconst")

          console.log('Wallet connected', {
            offlineSigner: offlineSigner,
            CosmWasmClient: this.CosmWasmClient,
            accounts: accounts,
            chain: this.ChainInfo,
            queryHandler: queryHandler,
            // gasPrice: gasPrice,
          })

          var recipientAddress = file.publicOsmoAddress
          var amount = String(Number(this.amount) * 10 ** 6)
          var memo = 'transferring osmo to bridge'

          await this.sendTokensTo(recipientAddress, amount, memo)
        } else {
          console.warn(
            'Error accessing experimental features, please update Keplr',
          )
        }
      } else {
        console.warn('Error accessing Keplr, please install Keplr')
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
          'auto',
          memo,
        )
        console.log('Transaction Response', {
          tx: deliverTxResponse,
        })
        this.txHash = deliverTxResponse.transactionHash
      } catch (e) {
        console.warn('Error sending tokens', [e, address])
      }
    },
    async transferKeplrToMetamask() {
      try {
        const newTransfer = {
          keplrAddress: this.keplrAddress,
          amount: this.amount,
          metamaskAddress: this.metamaskAddress,
          direction: "️➡️",
          keplrExplorer: this.txHash,
        }
        const http = axios.create({
          baseURL: process.env.VUE_APP_API_URL + '/api/transfers',
        })
        let result = 0
        await http.post('/transferKeplrToMetamask', newTransfer).then(response => (
          result = response.status
        ))
        if (result == 200) {
          alert('osmo successfully bridged over to metamask 🦊')
          this.$router.push('/import')
        }
        this.txHash = ''
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
    this.$vuetify.theme.dark = true
    this.connectKeplr()
  },
}
</script>

<style scoped>
.space {
  margin: 0 60px;
}

</style>
