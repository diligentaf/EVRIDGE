<template>
  <div>
    <v-progress-linear
      fixed
      v-if="loading"
      color="primary"
      indeterminate
      class="elevation-25"
      style="z-index: 6"
    />

    <v-app-bar
      app
      clipped-left
      color="#27242C"
      style="height: 100px; padding-top:20px;"
      class="bright--text"
    >
      <div class="d-flex align-center" @click="changeToHome">
        <Header />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        @click="changePage" 
      >
        <v-icon>mdi-account-search-outline</v-icon>&ensp;&ensp;
        Evridge&ensp;Scan 
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
import web3 from 'web3'
import Header from '../styled-components/Header'

export default {
  name: 'AppBar',

  data: () => ({
    client: undefined,
  }),
  components: {
    Header,
  },

  methods: {
    changeToHome() {
      this.$router.push('/')
    },
    changePage() {
      this.$router.push('/explorer')
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
    handleAccountsChanged(accounts) {
      this.client = accounts[0]
      localStorage.setItem('client', this.client)
      this.changeNetwork()
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
    checkConnection() {
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then(this.handleAccountsChanged)
        .catch(console.error)
    },
  },
  mounted() {
    this.checkConnection()
  },
  computed: {
    loading() {
      return this.$store.getters.loading
    },
  },
}
</script>
