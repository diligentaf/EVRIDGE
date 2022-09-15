import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { ethers } from 'ethers'
import { detectEthereumProvider } from '@metamask/detect-provider'
import { Web3 } from 'web3'
import { store } from './store'
import { createSimpleTransition } from 'vuetify/lib/components/transitions/createTransition'

const bounceTransition = createSimpleTransition('bounce-transition')

Vue.component('bounce-transition', bounceTransition)

Vue.config.productionTip = false
Vue.config.silent = true
Vue.prototype.$ethers = ethers
Vue.prototype.$detectEthereumProvider = detectEthereumProvider
Vue.prototype.$Web3 = Web3

new Vue({
  router,
  vuetify,
  store,
  ethers,
  detectEthereumProvider,
  Web3,
  render: (h) => h(App),
}).$mount('#app')
