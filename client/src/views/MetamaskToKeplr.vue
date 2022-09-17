<template>
  <div class="page-content">
    <v-layout justify-space-between align-content-center column>
      <Container>
        <TitleBox class="justify-center">🦊Metamask ➡️ 🪐Keplr
          <v-btn class="space" @click="changePage">switch</v-btn>
        </TitleBox>
        <v-select v-model="select" :items="coins" label="Select the Token" outlined></v-select>
        <AddressInputBox>
          <AddressInput v-model="metamaskAddress" placeholder="Your Metamask Address" />
        </AddressInputBox>
        <AddressInputBox>
          <AddressInput v-model="amount" placeholder="0.0" />
          <CurrencyBox>OSMO $</CurrencyBox>
        </AddressInputBox>
        <div class="d-flex justify-center mb-6">⬇️</div>
        <AddressInputBox>
          <AddressInput v-model="keplrAddress" placeholder="To Keplr" />
        </AddressInputBox>
        <SubmitButton @click="submit()" :loading="loading">Submit</SubmitButton>
      </Container>

      <v-row justify="center">
        <v-dialog v-model="bridging" persistent max-width="330">
          <v-card>
            <v-card-title class="text-h5">
              Don't Panic 🟢 <br />
              Transaction in Process ..
            </v-card-title>
            <v-card-text v-if="astep">➡️ transferring your osmo<v-progress-circular indeterminate color="green">
              </v-progress-circular>
            </v-card-text>
            <v-card-text v-else>transferring your osmo ✅</v-card-text>
            <v-card-text v-if="bstep">➡️ transferring to keplr <v-progress-circular indeterminate color="green">
              </v-progress-circular>
            </v-card-text>
            <v-card-text v-else-if="bstep == false && astep == true"></v-card-text>
            <v-card-text v-else> transferring to keplr ✅</v-card-text>
            <v-card-text v-if="cstep">➡️ Done ✅</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-layout>
  </div>
</template>

<script>
import { loadingStates } from '../mixins/loading-state'
import web3 from 'web3'
import TokenJson from '@/artifacts/contracts/Token.sol/Token.json'
import axios from 'axios'
import file from '@/data/secret.json'
import {
  Container,
  TitleBox,
  AddressInputBox,
  AddressInput,
  CurrencyBox,
  SubmitButton,
} from '../components/styled-components/SendBox'

// import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
// import { Decimal } from "@cosmjs/math"
// import { Bech32Address } from "@keplr-wallet/cosmos"

export default {
  name: 'MTK',
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
    bridging: false,
    astep: false,
    bstep: false,
    cstep: true,
    keplrAddress: '',
    metamaskAddress: '',
    amount: '',
    CosmWasmClient: {},
    ChainInfo: {},
    contractAddress: '',
    providekr: {},
    signer: {},
    publicMetamaskAddress: '',
    select: { text: 'OSMO', value: 'OSMO' },
    coins: [
      { text: 'OSMO', value: 'OSMO' },
      { text: 'ATOM (Coming Soon)', value: 'ATOM', disabled: true },
      { text: 'JUNO (Coming Soon)', value: 'JUNO', disabled: true },
      { text: 'CRO (Coming Soon)', value: 'CRO', disabled: true },
      { text: 'OKB (Coming Soon)', value: 'OKB', disabled: true },
      { text: 'RUNE (Coming Soon)', value: 'RUNE', disabled: true },
    ],
    txHash: '',
  }),

  methods: {
    changePage() {
      this.$router.push('/')
    },
    async submit() {
      this.txHash = ''
      this.bridging = true
      this.astep = false
      this.bstep = false
      this.cstep = false
      this.amount = String(this.amount)
      if (this.metamaskAddress.length !== 42) {
        this.$fire({
          title: "Please insert a proper address",
          type: "error",
        })
        this.bridging = false
        this.astep = false
        this.bstep = false
        this.cstep = false
        this.txHash = ''
        return
      }
      if (this.keplrAddress.length !== 43) {
        this.$fire({
          title: "Please insert a proper address",
          type: "error",
        })
        this.bridging = false
        this.astep = false
        this.bstep = false
        this.cstep = false
        this.txHash = ''
        return
      }
      this.bridging = true
      this.astep = true
      await this.transferToBridgeWallet()
      if (this.txHash !== '') {
        await this.transferMetamaskToKeplr()
      }
    },
    async transferToBridgeWallet() {
      try {
        let Token = new this.$ethers.Contract(this.contractAddress, TokenJson.abi, this.provider)
        let tx = {}
        await Token.connect(this.signer).transfer(this.publicMetamaskAddress, String(this.$ethers.utils.parseEther(this.amount))).then(function (txObj) {
          tx = txObj
        })
        await tx.wait()
        this.txHash = tx.hash
        this.astep = false
        this.bstep = true
      } catch (e) {
        this.$fire({
          title: "Transaction rejected. please try again",
          type: "error",
        })
        this.txHash = ''
        this.bridging = false
        this.astep = false
        this.bstep = false
        this.cstep = false
        console.warn('Error sending tokens', [e])
      }
    },
    async transferMetamaskToKeplr() {
      try {
        const newTransfer = {
          keplrAddress: this.keplrAddress,
          amount: this.amount,
          metamaskAddress: this.metamaskAddress,
          direction: "️⬅️",
          metamaskExplorer: this.txHash,
        }
        const http = axios.create({
          baseURL: process.env.VUE_APP_API_URL + '/api/transfers',
        })
        let result = 0
        await http.post('/transferMetamaskToKeplr', newTransfer).then(response => (
          result = response.status
        ))
        if (result == 200) {
          this.$fire({
            title: "OSMO successfully transferred to 🅾🆂🅼🅾🆂🅸🆂 🪐",
            text: "check your transaction in explorer 🔍",
            type: "success",
          }).then(r => {
            this.txHash = ''
            this.bridging = false
            this.astep = false
            this.bstep = false
            this.cstep = false
            this.$router.push('/explorer')
          })
        }
      } catch (e) {
        this.txHash = ''
        this.$fire({
          title: "something terribly went wrong. please contact yewon 👧🏻",
          text: "it's all her fault",
          type: "error",
        })
        console.error(e)
        this.$emit('error', { e})
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
    },
    handleAccountsChanged(accounts) {
      this.metamaskAddress = accounts[0]
      localStorage.setItem('client', this.client)
      this.changeNetwork()
    },
    checkConnection() {
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then(this.handleAccountsChanged)
        .catch(console.error)
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
    async checkBalance() {
      this.Token = new this.$ethers.Contract(
        this.contractAddress,
        TokenJson.abi,
        this.provider,
      )

      // MOOG getting token balance
      const result = await this.Token.balanceOf(this.metamaskAddress)
      const format = this.$ethers.utils.formatEther(result)
      this.amount = format
    },
  },
  async mounted() {
    this.$vuetify.theme.dark = true
    this.contractAddress = file.tokenAddress
    this.publicMetamaskAddress = file.publicMetamaskAddress
    await this.connectWallet()
    this.provider = new this.$ethers.providers.Web3Provider(
      window.ethereum,
      'any',
    )
    this.signer = this.provider.getSigner()
    await this.checkBalance()
  },
  async updated() {
  },
}
</script>

<style scoped>
.space {
  margin: 0 60px;
}
</style>
