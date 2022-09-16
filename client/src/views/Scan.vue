<template>
  <div class="page-content">
    <v-layout justify-space-between align-content-center column>
      <v-layout justify-space-between align-content-center>
        <h2>Transfer Cosmos Token to Metamask</h2>
        <ul>
          <li v-for="item in list" :key="item._id">
            <div class="d-flex flex-column align-start pl-1">
              <div class="d-flex">item id : {{ item._id }}</div>
              <div class="d-flex">amount : {{ item.amount }}</div>
              <div class="d-flex">keplr address: {{ item.keplrAddress }}</div>
              <div class="d-flex">metamask address: {{ item.metamaskAddress }}</div>
              <div class="d-flex">triggered at : {{ item.createdAt }}</div>
            </div>
          </li>
        </ul>
      </v-layout>
    </v-layout>
  </div>
</template>

<script>
import { loadingStates } from '../mixins/loading-state'
import axios from 'axios'

export default {
  name: 'Scan',
  mixins: [loadingStates],

  components: {
  },

  data: () => ({
    list: [],
  }),

  methods: {
  },
  async mounted() {
    const http = await axios.create({
      baseURL: process.env.VUE_APP_API_URL + '/api/transfers',
    })
    await http.get('/').then(response => (
      this.list = response.data.transfers
    ))
  },
}
</script>

<style>

</style>
