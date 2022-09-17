<template>
  <div class="page-content">
    <v-layout justify-space-between align-content-center column>
      <FullContainer>
        <HeaderBox>Transactions with EVRIDGE</HeaderBox>
        <Container v-if="listExist">
          <h2>Transactions</h2>
          <StyledTable>
            <colgroup>
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th v-for="(title, index) in titleList" :key="index">
                  <TitleBox>
                    {{ title }}
                  </TitleBox>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in list" :key="index">
                <td v-for="(title, index) in titleList" :key="index">
                  <ContentBox>{{ walletAddressConverter(item[title], title) }}</ContentBox>
                </td>
              </tr>
            </tbody>
          </StyledTable>
          <TableMarkup :titles="Object.keys(list[0])" :data="list" />
        </Container>
      </FullContainer>
    </v-layout>
  </div>
</template>

<script>
import { loadingStates } from '../mixins/loading-state'
import axios from 'axios'
import {
  Container,
  FullContainer,
  HeaderBox,
} from '../components/styled-components/Transactions'
import { StyledTable, TitleBox, ContentBox } from '../components/styled-components/Table'

export default {
  name: 'Scan',
  mixins: [loadingStates],
  components: {
    Container,
    StyledTable,
    TitleBox,
    FullContainer,
    HeaderBox,
    ContentBox,
  },
  data: () => ({
    list: [],
    listExist: false,
    titleList: [
      'keplrExplorer',
      'metamaskExplorer',
      'keplrAddress',
      'direction',
      'metamaskAddress',
      'amount',
      'createdAt',
    ],
  }),
  watch: {
    list() {
      console.log(this.list)
      if (this.list.length > 0) {
        this.listExist = true
      }
    },
  },
  methods: {
    walletAddressConverter(walletAddress, title) {
      function pad(n) {
        return n < 10 ? '0' + n : n
      }
      console.log(walletAddress)
      let returnString = ''
      if (title == 'keplrAddress' || title == 'metamaskAddress') {
        if (walletAddress?.length > 15) {
          returnString =
            walletAddress.substr(0, 6) +
            '...' +
            walletAddress.substr(walletAddress.length - 6, walletAddress.length)
        }
      } else if (title == 'amount') {
        returnString = walletAddress + ' OSMO'
      } else if (title == 'createdAt' || title == 'updatedAt') {
        returnString =
          pad(new Date(walletAddress).getFullYear().toString()) +
          '.' +
          pad(new Date(walletAddress).getUTCMonth() + 1) +
          '.' +
          pad(new Date(walletAddress).getUTCDate()) +
          ' ' +
          pad(new Date(walletAddress).getUTCHours()) +
          ':' +
          pad(new Date(walletAddress).getUTCMinutes()) +
          ':' +
          pad(new Date(walletAddress).getUTCSeconds())
      } else {
        returnString = walletAddress
      }
      console.log(returnString)
      return returnString
    },
  },
  async mounted() {
    this.$vuetify.theme.dark = true
    const http = await axios.create({
      baseURL: process.env.VUE_APP_API_URL + '/api/transfers',
    })
    await http
      .get('/')
      .then((response) => (this.list = response.data.transfers))
  },
}
</script>

<style></style>
