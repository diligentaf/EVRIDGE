<template>
  <div class="page-content">
    <v-layout justify-space-between align-content-center column>
      <Container>
        <TitleBox>🦊Metamask ➡️ 🪐Keplr
          <v-btn @click="changePage">switch</v-btn>
        </TitleBox>
        <AddressInputBox>
          <AddressInput v-model="metamaskAddress" placeholder="Send to (Metamask Address)" />
        </AddressInputBox>
        <AddressInputBox>
          <AddressInput v-model="keplrAddress" placeholder="Your Keplr Address" />
        </AddressInputBox>
        <AddressInputBox>
          <AddressInput v-model="amount" placeholder="0.0" />
          <CurrencyBox>OSMO $</CurrencyBox>
        </AddressInputBox>
        <SubmitButton @click="submit()" :loading="loading">Submit</SubmitButton>
      </Container>
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
    keplrAddress: '',
    metamaskAddress: '',
    amount: '',
    CosmWasmClient: {},
    ChainInfo: {},
    contractAddress: '',
    providekr: {},
    signer: {},
    publicMetamaskAddress: '',
  }),

  methods: {
    changePage() {
      this.$router.push('/')
    },
    async submit() {
      this.amount = String(this.amount)
      if (this.metamaskAddress.length !== 42) {
        alert('please insert a proper address')
        return
      }
      if (this.keplrAddress.length !== 43) {
        alert('please input proper osmosis address')
        return
      }
      await this.transferToBridgeWallet()
      await this.transferMetamaskToKeplr()
    },
    async transferToBridgeWallet() {
      let Token = new this.$ethers.Contract(this.contractAddress, TokenJson.abi, this.provider)
      let tx = {}
      await Token.connect(this.signer).transfer(this.publicMetamaskAddress, String(this.$ethers.utils.parseEther(this.amount))).then(function (txObj) {
        tx = txObj
      })
      await tx.wait()
    },
    async transferMetamaskToKeplr() {
      const newTransfer = {
        keplrAddress: this.keplrAddress,
        amount: this.amount,
        metamaskAddress: this.metamaskAddress,
      }
      const http = axios.create({
        baseURL: process.env.VUE_APP_API_URL + '/api/transfers',
      })
      let result = 0
      await http.post('/transferMetamaskToKeplr', newTransfer).then(response => (
        result = response.status
      ))
      if (result == 200) {
        alert('osmo successfully bridged over to keplr 🪐')
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

<style>

</style>
