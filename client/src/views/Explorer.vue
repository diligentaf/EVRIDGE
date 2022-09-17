<template>
  <div class="page-content">
    <v-layout justify-space-between align-content-center column>
      <v-data-table :headers="headers" :items="items" :search="search" :footer-props="{
        'items-per-page-options':[10000000],
        'disable-items-per-page': true,
      }">
        <template v-slot:top>
          <v-text-field v-model="search" label="🔍 Search by Address, Currency, and TxHash" class="mx-4"></v-text-field>
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn @click="openEvmosScan(item.metamaskExplorer)">🦊</v-btn> &ensp;
          <v-btn @click="openMintScan(item.keplrExplorer)">🪐</v-btn>
        </template>
        <template v-slot:[`item.amount`]="{ item }">{{ item.amount }} OSMO</template>
        <template v-slot:[`item.direction`]="{ item }">
            {{ item.direction}}{{item.direction}}{{item.direction}}<br>
        </template>
        <template v-slot:[`item.keplrAddress`]="{ item }">
          <v-btn @click="openCosmosAccount(item.keplrAddress)">{{item.keplrAddress}}</v-btn>
        </template>
        <template v-slot:[`item.metamaskAddress`]="{ item }">
          <v-btn @click="openEvmosAccount(item.metamaskAddress)">{{item.metamaskAddress}}</v-btn>
        </template>
      </v-data-table>

    </v-layout>
  </div>
</template>

<script>
import axios from 'axios'
import { loadingStates } from '../mixins/loading-state'

export default {
  name: 'Scan',
  mixins: [loadingStates],
  components: {
  },
  data: () => ({
    search: '',
    items: [],
    calories: '',
  }),
  methods: {
    openEvmosScan(item) {
      window.open(`https://evm.evmos.org/tx/${item}`, "_blank")
    },
    openMintScan(item) {
      window.open(`https://www.mintscan.io/osmosis/txs/${item}`, "_blank")
    },
    openCosmosAccount(item) {
      window.open(`https://www.mintscan.io/osmosis/account/${item}`, "_blank")
    },
    openEvmosAccount(item) {
      window.open(`https://evm.evmos.org/address/${item}/transactions`, "_blank")
    },
  },
  computed: {
    headers() {
      return [
        { text: "open explorers", value: "action" },
        { text: 'amount', value: 'amount', width: '5%' },
        { text: 'keplrAddress', value: 'keplrAddress' },
        { text: 'direction', value: 'direction', width: '5%' },
        { text: 'metamaskAddress', value: 'metamaskAddress' },
        { text: 'transactions occured', value: 'createdAt', width: '5%'},
      ]
    },
  },
  async mounted() {
    this.$vuetify.theme.dark = true
    const http = await axios.create({
      baseURL: process.env.VUE_APP_API_URL + '/api/transfers',
    })
    await http
      .get('/')
      .then((response) => (this.items = response.data.transfers))
  },
}
</script>

<style>

</style>
